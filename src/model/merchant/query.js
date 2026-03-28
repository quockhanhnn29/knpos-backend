const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const type_report = require('./type_report_custom')
const lodash = require('lodash')
const Merchant = require("./merchant")
const Agent = require("../agent/agent")
const type_fee_rate = require('./type_fee_rate_custom')
const type_fee_rate_log = require('./type_fee_rate_log_custom')
const FeeRate = require("./fee_rate")
const FeeRateLog = require("./fee_rate_log")

// Defines the queries
module.exports = {
    merchants: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            quick_search: {
                type: GraphQLString
            },
            mid: {
                type: new GraphQLList(GraphQLString)
            },
            tid: {
                type: new GraphQLList(GraphQLString)
            },
            agent_id: {
                type: new GraphQLList(GraphQLInt)
            },
            status: {
                type: new GraphQLList(GraphQLInt)
            },
            kn_office_id: {
                type: new GraphQLList(GraphQLInt)
            },
            loai_hinh_kd_id: {
                type: new GraphQLList(GraphQLInt)
            },
            checklist_process: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_branch_id: {
                type: new GraphQLList(GraphQLInt)
            },
            modified_date_from: {
                type: GraphQLString
            },
            modified_date_to: {
                type: GraphQLString
            },
            page_size: {
                type: GraphQLInt
            },
            page_index: {
                type: GraphQLInt
            },
            order_column: {
                type: GraphQLString
            },
            order_direction: {
                type: GraphQLBoolean
            }
        },
        resolve: async (_, args, context) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 10;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let condition = '';
            if (args.quick_search) {
                let string = args.quick_search.toLowerCase();
                condition += ` and (LOWER(c.ten) LIKE '%${string}%' OR LOWER(c.maso) LIKE '%${string}%' OR LOWER(c.maso_dk) LIKE '%${string}%' OR LOWER(c.so_cccd) LIKE '%${string}%')`;
            }
            if (args.mid && args.mid.length > 0) {
                let mids = '';
                args.mid.forEach(mid => {
                    mids += `,"${mid}"`;
                });
                mids = mids.replace(',', '');
                condition += ` and mb.mid IN (${mids})`;
            }
            if (args.tid && args.tid.length > 0) {
                let tids = '';
                args.tid.forEach(tid => {
                    tids += `,"${tid}"`;
                });
                tids = tids.replace(',', '');
                condition += ` and mb.tid IN (${tids})`;
            }
            if (args.agent_id && args.agent_id.length > 0) {
                let agents = '';
                args.agent_id.forEach(agent => {
                    agents += `,${agent}`;
                });
                agents = agents.replace(',', '');
                condition += ` and m.agent_id IN (${agents})`;
            }
            if (args.kn_office_id) {
                condition += ` and m.kn_office_id IN (${args.kn_office_id})`;
            }
            if (args.loai_hinh_kd_id) {
                condition += ` and m.loai_hinh_kd IN (${args.loai_hinh_kd_id})`;
            }
            if (args.checklist_process) {
                condition += ` and mc.id IN (${args.checklist_process})`;
            }
            if (args.bank_id && args.bank_id.length > 0) {
                condition += ` and b.bank_id IN (${args.bank_id})`;
            }
            if (args.bank_branch_id && args.bank_branch_id.length > 0) {
                condition += ` and m.chi_nhanh_bank_id IN (${args.bank_branch_id})`;
            }
            if (args.status && args.status.length > 0) {
                let status = '';
                args.status.forEach(s => {
                    status += `,${s}`;
                });
                status = status.replace(',', '');
                condition += ` and m.status IN (${status})`;
            }
            if (args.modified_date_from && args.modified_date_to) {
                condition += ` and m.modified_date >= "${args.modified_date_from}" and m.modified_date <= "${args.modified_date_to}"`;
            }
            let baseQuery = `select m.*, c.ten as ten_client, c.type as type, m.loai_hinh_kd as loai_hinh_kd, bank.ten_bank as bank_name, b.ten_chi_nhanh as ten_chi_nhanh, a.ten_dai_ly as agent_name from merchant m 
            left join client c on m.client_id = c.id 
            left join merchant_bank mb on mb.merchant_id = m.id 
            left join bank_branch b on b.id = m.chi_nhanh_bank_id 
            left join bank on bank.id = b.bank_id 
            left join offices o on o.id = m.kn_office_id 
            left join (
            	SELECT c.id, c.text, p.merchant_id, p.status from merchant_checklist c 
            	JOIN merchant_checklist_process p on p.checklist_id = c.id
            	JOIN (
            		SELECT c.id, c1.max_status, MAX(c.sort_order) as max_order, c1.merchant_id from merchant_checklist c 
            		JOIN merchant_checklist_process p on p.checklist_id = c.id
            		JOIN (
            			SELECT MAX(c.merchant_status) as max_status, p.checklist_id, p.merchant_id from merchant_checklist c 
            			JOIN merchant_checklist_process p on p.checklist_id = c.id 
            			WHERE p.status = 1 GROUP BY p.merchant_id
            		) c1 ON c1.max_status = c.merchant_status and p.merchant_id = c1.merchant_id WHERE p.status = 1 GROUP BY c1.merchant_id
            	) c2 ON c2.max_order = c.sort_order and c2.max_status = c.merchant_status and p.merchant_id = c2.merchant_id
            ) mc on mc.merchant_id = m.id 
            left join agent a on a.id = m.agent_id where m.soft_deleted = 0 ${condition}`;
            let groupQuery = ` group by m.id`;
            let items = await Merchant.findByFields2({baseQuery, groupQuery, alias: 'm.', fields: [], limit, offset, order})
            if (items.length > 0) {
                let total_items = await Merchant.findByFields2({baseQuery, groupQuery, alias: 'm.', fields: [], limit: null, offset: null, order})
                return {total_item: total_items.length, items}
            } else return {
                total_item: 0,
                items: []
            }
        }
    },
    merchant_existed: {
        type: GraphQLBoolean,
        args: {
            client_id: { type: GraphQLInt },
            bank_id: { type: GraphQLInt },
            loai_hinh_kd: { type: GraphQLInt }
        },
        resolve: async (_, args, context) => {
            let query = `select m.* from merchant m 
            left join bank_branch b on b.id = m.chi_nhanh_bank_id 
            where m.soft_deleted = 0 and m.status IN (0,1,2,3,4,5) and m.client_id = ${args.client_id} and b.bank_id = ${args.bank_id} and m.loai_hinh_kd = ${args.loai_hinh_kd}`
            let items = await Merchant.findByFields2({baseQuery: query, groupQuery: '', alias: 'm.', fields: [], limit: null, offset: null, order: null});
            return items.length > 0;
        }
    },
    merchant: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await Merchant.findOne(_, [], args)
        }
    },
    merchant_report: {
        type: type_report,
        args: null,
        resolve: async (_, args, context) => {
            let params = [];
            let query = `SELECT m.agent_id, m.kn_office_id, m.status, count(m.id) as value from merchant m 
                    LEFT JOIN agent a on m.agent_id = a.id 
                    WHERE m.soft_deleted = 0 and a.soft_deleted = 0
                    GROUP BY m.agent_id, m.kn_office_id, m.status
                    ORDER BY m.agent_id`;
            let agentQuery = `SELECT a.id, a.ten_dai_ly as agent_name, m.kn_office_id from agent a JOIN merchant m ON m.agent_id = a.id WHERE a.soft_deleted = 0 and m.soft_deleted = 0 
                    GROUP BY a.id, m.kn_office_id ORDER BY a.id`;
            const res = await Merchant.executeQueryString2(query, params);
            const agentIds = await Agent.executeQueryString2(agentQuery, params);
            let kn_offices = [1, 2];
            let items = [];
            let status = [
                {
                    value: 0,
                    condition: [0,1,2,3,4,5,6,7]
                },
                {
                    value: 1,
                    condition: [0,1]
                },
                {
                    value: 2,
                    condition: [2]
                },
                {
                    value: 3,
                    condition: [3]
                },
                {
                    value: 4,
                    condition: [4]
                },
                {
                    value: 5,
                    condition: [5,7]
                },
                {
                    value: 6,
                    condition: [6]
                }
            ];
            kn_offices.forEach((office_id) => {
                let item = [];
                if (agentIds && agentIds.length) {
                    let agents = lodash.filter(agentIds, a => a.kn_office_id == office_id);
                    agents.forEach(a => {
                        let id = a.id;
                        status.forEach(s => {
                            let list = lodash.filter(res, p => p.agent_id == id && p.kn_office_id == office_id && s.condition.includes(p.status));
                            item.push({
                                agent_id: id,
                                agent_name: a.agent_name,
                                status: s.value,
                                value: list && list.length > 0 ? lodash.sumBy(list, 'value') : 0
                            });
                        })
                    })
                }
                items.push(item);
            })

            return {
                items_kn_hn: items[0],
                items_kn_hcm: items[1]
            }
        }
    },
    merchant_fee_rate: {
        type: type_fee_rate,
        args: {
            merchant_id: {
                type: GraphQLInt
            },
            page_size: {
                type: GraphQLInt
            },
            page_index: {
                type: GraphQLInt
            },
        },
        resolve: async (_, args, context) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 5000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: 'id',
                direction: 'ASC'
            }
            delete args.page_size
            delete args.page_index
            let baseQuery = `select t.* from merchant_fee_rate t where t.soft_deleted = 0 and t.merchant_id = ${args.merchant_id}`
            let groupQuery = ` group by t.id`
            let items = await FeeRate.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
    merchant_fee_rate_log: {
        type: type_fee_rate_log,
        args: {
            merchant_id: {
                type: GraphQLInt
            },
            loai_the_id: {
                type: GraphQLInt
            },
            page_size: {
                type: GraphQLInt
            },
            page_index: {
                type: GraphQLInt
            },
        },
        resolve: async (_, args, context) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 5000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: 'timestamp',
                direction: 'DESC'
            }
            let condition = '';
            if (args.loai_the_id) {
                condition += ` and f.loai_the_id = ${args.loai_the_id}`;
            }
            delete args.page_size
            delete args.page_index
            let baseQuery = `select t.* from merchant_fee_rate_log t join merchant_fee_rate f on f.id = t.merchant_fee_rate_id where t.merchant_id = ${args.merchant_id} ${condition}`
            let groupQuery = ` group by t.id`
            let items = await FeeRateLog.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
}