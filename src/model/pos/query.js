const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const type_report = require('./type_report_custom')
const lodash = require('lodash')
const Pos = require("./pos")
const PosModel = require("../pos_model/pos_model")

// Defines the queries
module.exports = {
    poses: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            seri: {
                type: GraphQLString
            },
            so_hd: {
                type: GraphQLString
            },
            supplier_id: {
                type: GraphQLInt
            },
            loai_kho: {
                type: new GraphQLList(GraphQLInt)
            },
            loai_may_id: {
                type: new GraphQLList(GraphQLInt)
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
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            status: {
                type: new GraphQLList(GraphQLInt)
            },
            kn_office_id: {
                type: new GraphQLList(GraphQLInt)
            },
            ngay_nhap_kho_from: {
                type: GraphQLString
            },
            ngay_nhap_kho_to: {
                type: GraphQLString
            },
            ngay_ban_giao_from: {
                type: GraphQLString
            },
            ngay_ban_giao_to: {
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
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 1000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let condition = '';
            if (args.seri) {
                condition += ` and LOWER(p.seri) LIKE '%${args.seri.toLowerCase()}%'`;
            }
            if (args.so_hd) {
                condition += ` and LOWER(c.so_hd) LIKE '%${args.so_hd.toLowerCase()}%'`;
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
            if (args.bank_id && args.bank_id.length > 0) {
                let bank_id = '';
                args.bank_id.forEach(b => {
                    bank_id += `,${b}`;
                });
                bank_id = bank_id.replace(',', '');
                condition += ` and p.bank_id IN (${bank_id})`;
            }
            if (args.kn_office_id && args.kn_office_id.length > 0) {
                let offices = '';
                args.kn_office_id.forEach(id => {
                    offices += `,${id}`;
                });
                offices = offices.replace(',', '');
                condition += ` and p.kn_office_id IN (${offices})`;
            }
            if (args.loai_kho) {
                condition += ` and p.loai_kho IN (${args.loai_kho})`;
            }
            if (args.supplier_id) {
                condition += ` and p.supplier_id = ${args.supplier_id}`;
            }
            if (args.loai_may_id) {
                condition += ` and p.loai_may_id IN (${args.loai_may_id})`;
            }
            if (args.status && args.status.length > 0) {
                let status = '';
                args.status.forEach(s => {
                    status += `,${s}`;
                });
                status = status.replace(',', '');
                condition += ` and p.status IN (${status})`;
            }
            if (args.ngay_nhap_kho_from && args.ngay_nhap_kho_to) {
                condition += ` and p.ngay_nhap_kho >= "${args.ngay_nhap_kho_from}" and p.ngay_nhap_kho <= "${args.ngay_nhap_kho_to}"`;
            }
            if (args.ngay_ban_giao_from && args.ngay_ban_giao_to) {
                condition += ` and mbp.ngay_ban_giao >= "${args.ngay_ban_giao_from}" and mbp.ngay_ban_giao <= "${args.ngay_ban_giao_to}"`;
            }
            let baseQuery = `select p.*, mc.ten as merchant_name, c.so_hd as so_hd, pp.ten as provider_name, pm.ten as loai_may, mbp.ngay_ban_giao as ngay_ban_giao, a.ten_dai_ly as agent_name, s.ten as supplier, o.office_name as office_name from pos p 
            left join pos_contract c on c.id = p.contract_id 
            left join pos_provider pp on pp.id = c.provider_id 
            left join supplier_pos_model pm on pm.id = p.loai_may_id 
            left join supplier_pos s on s.id = p.supplier_id 
            left join merchant_bank mb on mb.pos_id = p.id and mb.soft_deleted = 0 and mb.status IN (0,1,2) 
            left join merchant_bank_pos mbp on mbp.pos_id = p.id and mbp.merchant_bank_id = mb.id and mbp.status IN (0,1) and mb.soft_deleted = 0 
            left join merchant m on m.id = mb.merchant_id 
            left join client mc on m.client_id = mc.id 
            left join offices o on o.id = m.kn_office_id 
            left join agent a on a.id = m.agent_id where p.soft_deleted = 0 ${condition}`;
            let groupQuery = ` group by p.id, p.seri`
            let items = await Pos.findByFields2({baseQuery, groupQuery, alias: 'p.', fields: [], limit, offset, order})
            let no_limited_items = await Pos.findByFields2({baseQuery, groupQuery, alias: 'p.', fields: [], limit: null, offset: null, order})
            return {total_item: no_limited_items.length, items}
        }
    },
    pos_by_supplier: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            supplier_id: {
                type: GraphQLID
            },
            loai_may_id: {
                type: GraphQLID
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
            limit = limit > 0 ? limit : 1000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            delete args.page_size
            delete args.page_index
            delete args.order_column
            delete args.order_direction
            args.soft_deleted = 0
            args.status = 0
            let baseQuery = `select p.* from pos p `
            let groupQuery = ` group by p.id, p.seri`
            let items = await Pos.findByFields2({baseQuery, groupQuery, alias: 'p.', fields: args, limit, offset, order})
            let total_item = await Pos.totalRow({fields: args});
            return {total_item, items}
        }
    },
    pos: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await Pos.findOne(_, [], args)
        }
    },
    pos_report: {
        type: type_report,
        args: null,
        resolve: async (_, args, context) => {
            let params = [];
            let query = `SELECT p.loai_may_id, p.kn_office_id, p.status, p.hoan_tra, count(p.id) as value from pos p 
                    JOIN supplier_pos_model m on m.id = p.loai_may_id 
                    WHERE m.soft_deleted = 0 and p.soft_deleted = 0
                    GROUP BY p.loai_may_id, p.kn_office_id, p.status
                    ORDER BY p.loai_may_id`;
            let modelQuery = `SELECT m.id, m.ten as pos_model from supplier_pos_model m WHERE m.soft_deleted = 0 ORDER BY m.id`;
            const res = await Pos.executeQueryString2(query, params);
            const modelIds = await PosModel.executeQueryString2(modelQuery, params);
            let kn_offices = [0, 1, 2];
            let items = [];
            let status = [
                {
                    value: 0,
                    condition: [0,1,2,3,4]
                },
                {
                    value: 1,
                    condition: [0]
                },
                {
                    value: 2,
                    condition: [1]
                },
                {
                    value: 3,
                    condition: [2]
                },
                {
                    value: 4,
                    condition: [4]
                },
                {
                    value: 5,
                    condition: [3]
                },
                {
                    value: 6,
                    condition: []
                }
            ];
            kn_offices.forEach((office_id) => {
                let item = [];
                if (modelIds && modelIds.length) {
                    modelIds.forEach(a => {
                        let id = a.id;
                        status.forEach(s => {
                            let list = s.value == 6 ? lodash.filter(res, p => p.loai_may_id == id && p.kn_office_id == office_id && p.hoan_tra == 1) : lodash.filter(res, p => p.loai_may_id == id && p.kn_office_id == office_id && s.condition.includes(p.status));
                            item.push({
                                pos_model_id: id,
                                pos_model: a.pos_model,
                                status: s.value,
                                value: list && list.length > 0 ? lodash.sumBy(list, 'value') : 0
                            });
                        })
                    })
                }
                items.push(item);
            })

            return {
                items_kn_all: items[0],
                items_kn_hn: items[1],
                items_kn_hcm: items[2]
            }
        }
    }
}