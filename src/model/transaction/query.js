const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const type_chart = require('./type_chart_custom')
const Transaction = require('./transaction')
const lodash = require('lodash')
const moment = require('moment')

// Defines the queries
module.exports = {
    transactions: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            time_gd_from: {
                type: GraphQLString
            },
            time_gd_to: {
                type: GraphQLString
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
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_branch_id: {
                type: new GraphQLList(GraphQLInt)
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
        resolve: async (_, args, context, info) => {            
            // make sure user is authenticated
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 5000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let condition = '';
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
                condition += ` and m.agent_id IN (${args.agent_id})`;
            }
            if (args.kn_office_id && args.kn_office_id.length > 0) {
                condition += ` and m.kn_office_id IN (${args.kn_office_id})`;
            }
            if (args.bank_id && args.bank_id.length > 0) {
                condition += ` and b.bank_id IN (${args.bank_id})`;
            }
            if (args.bank_branch_id && args.bank_branch_id.length > 0) {
                condition += ` and m.chi_nhanh_bank_id IN (${args.bank_branch_id})`;
            }
            if (args.quick_search) {
                condition += ` AND (LOWER(mb.ten_hkd_bank) LIKE '%${args.quick_search}%' OR LOWER(m.ten) LIKE '%${args.quick_search}%' OR LOWER(m.maso) LIKE '%${args.quick_search}%' OR LOWER(m.maso_dk) LIKE '%${args.quick_search}%' OR LOWER(m.so_cccd) LIKE '%${args.quick_search}%')`
            }

            let joinQuery = ` FROM kn_transaction as t 
            JOIN merchant_bank mb ON t.tid = mb.tid and t.bank_id = mb.bank_id 
            JOIN merchant m ON mb.merchant_id = m.id 
            JOIN bank_branch b on b.id = m.chi_nhanh_bank_id 
            JOIN bank on bank.id = b.bank_id  
            JOIN agent a ON m.agent_id = a.id where t.time_gd >= "${args.time_gd_from}" AND t.time_gd <= "${args.time_gd_to}" ${condition}`

            let baseQuery = `SELECT t.*, mb.ten_hkd_bank as merchant_bank, a.ten_dai_ly as agent_name, count(t.id) as so_gd, SUM(t.so_tien_gd) as tong_gd, SUM(t.so_tien_bc) as tong_bc, SUM(t.so_tien_phi) as tong_phi` + joinQuery;
            let totalQuery = `SELECT count(t.id) as so_gd_total, SUM(t.so_tien_gd) as total_value_gd, SUM(t.so_tien_bc) as total_value_bc, SUM(t.so_tien_phi) as total_value_phi ` + joinQuery;
            let groupQuery = ` group by t.tid`;

            let items = await Transaction.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            if (items.length <= 0) return {
                total_item: 0, 
                so_gd_total: 0, 
                total_value_gd: 0, 
                total_value_bc: 0, 
                total_value_phi: 0, 
                items: []
            }
            let total_items = await Transaction.findByFields2({baseQuery: totalQuery, groupQuery: '', alias: 't.', fields: [], limit: null, offset: null, order: null})
            let no_limited_items = await Transaction.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit: null, offset: null, order: null})
            return {
                total_item: no_limited_items.length, 
                so_gd_total: total_items[0].so_gd_total, 
                total_value_gd: total_items[0].total_value_gd, 
                total_value_bc: total_items[0].total_value_bc, 
                total_value_phi: total_items[0].total_value_phi, 
                items
            }
        }
    },

    transaction_details: {
        type: type_custom,
        args: {
            time_gd_from: {
                type: GraphQLString
            },
            time_gd_to: {
                type: GraphQLString
            },
            mid: {
                type: new GraphQLList(GraphQLString)
            },
            tid: {
                type: new GraphQLList(GraphQLString)
            },
            bank_id: {
                type: GraphQLInt
            },
            ma_chuan_chi: {
                type: GraphQLString
            },
            so_tc: {
                type: GraphQLString
            },
            page_size: {
                type: GraphQLInt
            },
            page_index: {
                type: GraphQLInt
            }
        },
        resolve: async (_, args, context, info) => {            
            // make sure user is authenticated
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 10000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: 'time_gd',
                direction: 'DESC'
            }
            let condition = '';
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
            if (args.ma_chuan_chi) {
                condition += ` and t.ma_chuan_chi = "${args.ma_chuan_chi}"`;
            }
            if (args.so_tc) {
                condition += ` and t.so_tc = "${args.so_tc}"`;
            }
            if (args.bank_id) {
                condition += ` and t.bank_id = ${args.bank_id}`;
            }

            let baseQuery = `SELECT t.* FROM kn_transaction as t JOIN merchant_bank mb ON t.tid = mb.tid and t.bank_id = mb.bank_id 
            where t.time_gd >= "${args.time_gd_from}" AND t.time_gd <= "${args.time_gd_to}" ${condition}`;
            let groupQuery = ``;

            let items = await Transaction.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            if (items.length <= 0) return {
                total_item: 0, 
                items: []
            }
            let no_limited_items = await Transaction.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit: null, offset: null, order: null})
            return {
                total_item: no_limited_items.length, 
                items
            }
        }
    },

    transactions_line: {
        type: type_chart,
        args: {
            id: {
                type: GraphQLID
            },
            time_gd_from: {
                type: GraphQLString
            },
            time_gd_to: {
                type: GraphQLString
            },
            metric_type: {
                type: GraphQLString
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
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_branch_id: {
                type: new GraphQLList(GraphQLInt)
            }
        },
        resolve: async (_, args, context, info) => {            
            // make sure user is authenticated
            let condition = '';
            if (args.mid && args.mid.length > 0) {
                condition += ` and mb.mid IN (${args.mid})`;
            }
            if (args.tid && args.tid.length > 0) {
                condition += ` and mb.tid IN (${args.tid})`;
            }
            if (args.agent_id && args.agent_id.length > 0) {
                condition += ` and m.agent_id IN (${args.agent_id})`;
            }
            if (args.kn_office_id && args.kn_office_id.length > 0) {
                condition += ` and m.kn_office_id IN (${args.kn_office_id})`;
            }
            if (args.bank_id && args.bank_id.length > 0) {
                condition += ` and b.bank_id IN (${args.bank_id})`;
            }
            if (args.bank_branch_id && args.bank_branch_id.length > 0) {
                condition += ` and m.chi_nhanh_bank_id IN (${args.bank_branch_id})`;
            }
            if (args.quick_search) {
                condition += ` AND (LOWER(mb.ten_hkd_bank) LIKE '%${args.quick_search}%' OR LOWER(m.ten) LIKE '%${args.quick_search}%' OR LOWER(m.maso) LIKE '%${args.quick_search}%' OR LOWER(m.maso_dk) LIKE '%${args.quick_search}%' OR LOWER(m.so_cccd) LIKE '%${args.quick_search}%')`
            }

            let joinQuery = ` FROM kn_transaction as t 
            JOIN merchant_bank mb ON t.tid = mb.tid and t.bank_id = mb.bank_id 
            JOIN merchant m ON mb.merchant_id = m.id 
            JOIN bank_branch b on b.id = m.chi_nhanh_bank_id 
            JOIN bank on bank.id = b.bank_id  
            JOIN agent a ON m.agent_id = a.id`
            let items = [];

            let groupQuery = args.metric_type == 'day' ? ' group by date(t.time_gd)' : args.metric_type == 'isoWeek' ? ' group by week(t.time_gd, 1)' : ' group by month(t.time_gd)';
            let baseQuery = `SELECT date(t.time_gd) as date_from, count(t.id) as so_gd, SUM(t.so_tien_gd) as tong_gd, SUM(t.so_tien_bc) as tong_bc, SUM(t.so_tien_phi) as tong_phi ${joinQuery} where t.time_gd >= "${args.time_gd_from}" and t.time_gd <= "${args.time_gd_to}" ${condition}`;
            let data = await Transaction.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit: null, offset: null, order: null})

            let start = moment(args.time_gd_from).startOf(args.metric_type);
            let end = moment(args.time_gd_to).endOf(args.metric_type);
            while (start <= end) {
                let from = moment(start).startOf(args.metric_type);
                let to = moment(start).endOf(args.metric_type);
                let item = lodash.find(data, d => moment(d.date_from) >= moment(from) && moment(d.date_from) <= moment(to));
                if (item) {
                    items.push({
                        date_from: moment(from) < moment(args.time_gd_from) ? moment(args.time_gd_from).format('YYYY-MM-DD') : moment(from).format('YYYY-MM-DD'),
                        date_to: moment(to) > moment(args.time_gd_to) ? moment(args.time_gd_to).format('YYYY-MM-DD') : moment(to).format('YYYY-MM-DD'),
                        so_gd: item.so_gd || 0, 
                        tong_gd: item.tong_gd || 0, 
                        tong_bc: item.tong_bc || 0, 
                        tong_phi: item.tong_phi || 0
                    })
                } else {
                    items.push({
                        date_from: moment(from) < moment(args.time_gd_from) ? moment(args.time_gd_from).format('YYYY-MM-DD') : moment(from).format('YYYY-MM-DD'),
                        date_to: moment(to) > moment(args.time_gd_to) ? moment(args.time_gd_to).format('YYYY-MM-DD') : moment(to).format('YYYY-MM-DD'),
                        so_gd: 0, 
                        tong_gd: 0, 
                        tong_bc: 0, 
                        tong_phi: 0 
                    })
                }
                start = moment(start).add(1, args.metric_type);
            }

            if (items.length <= 0) return {
                items: []
            }
            return {
                items
            }
        }
    },

    transactions_pie: {
        type: type_chart,
        args: {
            id: {
                type: GraphQLID
            },
            time_gd_from: {
                type: GraphQLString
            },
            time_gd_to: {
                type: GraphQLString
            },
            metric_type: {
                type: GraphQLString
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
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_branch_id: {
                type: new GraphQLList(GraphQLInt)
            }
        },
        resolve: async (_, args, context, info) => {            
            // make sure user is authenticated
            let condition = '';
            if (args.mid && args.mid.length > 0) {
                condition += ` and mb.mid IN (${args.mid})`;
            }
            if (args.tid && args.tid.length > 0) {
                condition += ` and mb.tid IN (${args.tid})`;
            }
            if (args.agent_id && args.agent_id.length > 0) {
                condition += ` and m.agent_id IN (${args.agent_id})`;
            }
            if (args.kn_office_id && args.kn_office_id.length > 0) {
                condition += ` and m.kn_office_id IN (${args.kn_office_id})`;
            }
            if (args.bank_id && args.bank_id.length > 0) {
                condition += ` and b.bank_id IN (${args.bank_id})`;
            }
            if (args.bank_branch_id && args.bank_branch_id.length > 0) {
                condition += ` and m.chi_nhanh_bank_id IN (${args.bank_branch_id})`;
            }
            if (args.quick_search) {
                condition += ` AND (LOWER(mb.ten_hkd_bank) LIKE '%${args.quick_search}%' OR LOWER(m.ten) LIKE '%${args.quick_search}%' OR LOWER(m.maso) LIKE '%${args.quick_search}%' OR LOWER(m.maso_dk) LIKE '%${args.quick_search}%' OR LOWER(m.so_cccd) LIKE '%${args.quick_search}%')`
            }

            let joinQuery = ` FROM kn_transaction as t 
            JOIN merchant_bank mb ON t.tid = mb.tid and t.bank_id = mb.bank_id 
            JOIN merchant m ON mb.merchant_id = m.id 
            JOIN bank_branch b on b.id = m.chi_nhanh_bank_id 
            JOIN bank on bank.id = b.bank_id 
            JOIN agent a ON m.agent_id = a.id`

            let baseQuery = `SELECT a.ten_dai_ly as agent, count(t.id) as so_gd, SUM(t.so_tien_gd) as tong_gd, SUM(t.so_tien_bc) as tong_bc, SUM(t.so_tien_phi) as tong_phi ${joinQuery} 
            where t.time_gd >= "${args.time_gd_from}" and t.time_gd <= "${args.time_gd_to}" ${condition}`;
            delete args.time_gd_from
            delete args.time_gd_to
            let items = await Transaction.findByFields2({baseQuery, groupQuery: ' group by a.id', alias: 't.', fields: [], limit: null, offset: null, order: null})
            if (items.length <= 0) return {
                items: []
            }

            return {
                items
            }
        }
    }
}