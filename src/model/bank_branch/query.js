const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const type_fee_rate_single = require('./type_fee_rate')
const type_fee_rate = require('./type_fee_rate_custom')
const type_fee_rate_log = require('./type_fee_rate_log_custom')
const Bank = require("./bank_branch")
const FeeRate = require("./fee_rate")
const FeeRateLog = require("./fee_rate_log")

// Defines the queries
module.exports = {
    bank_branches: {
        type: type_custom,
        args: {
            loai_dvkd: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            quick_search: {
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
            limit = limit > 0 ? limit : 500;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let condition = '';
            if (args.quick_search) {
                let string = args.quick_search.toLowerCase();
                condition += ` and LOWER(a.ten_chi_nhanh) LIKE '%${string}%'`;
            }
            if (args.loai_dvkd && args.loai_dvkd.length > 0) {
                let types = '';
                args.loai_dvkd.forEach(t => {
                    types += `,${t}`;
                });
                types = types.replace(',', '');
                condition += ` and a.loai_dvkd IN (${types})`;
            }
            if (args.bank_id && args.bank_id.length > 0) {
                let banks = '';
                args.bank_id.forEach(b => {
                    banks += `,${b}`;
                });
                banks = banks.replace(',', '');
                condition += ` and a.bank_id IN (${banks})`;
            }
            let baseQuery = `select a.* from bank_branch a where a.status = 0 and a.soft_deleted = 0 ${condition}`;
            let groupQuery = ` group by a.id`;
            let items = await Bank.findByFields2({baseQuery, groupQuery, alias: 'a.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
    bank_branch: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await Bank.findOne(_, [], args)
        }
    },
    bank_fee_rate: {
        type: type_fee_rate,
        args: {
            chi_nhanh_bank_id: {
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
            let baseQuery = `select t.* from dvkd_fee_rate t where t.soft_deleted = 0 and t.chi_nhanh_bank_id = ${args.chi_nhanh_bank_id}`
            let groupQuery = ` group by t.id`
            let items = await FeeRate.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
    selected_bank_fee_rate: {
        type: type_fee_rate_single,
        args: {
            chi_nhanh_bank_id: {
                type: GraphQLInt
            },
            loai_hinh_kd_id: {
                type: GraphQLInt
            },
            loai_the_id: {
                type: GraphQLInt
            },
        },
        resolve: async (_, args, context) => {
            args.soft_deleted = 0;
            return await FeeRate.findOne(_, [], args)
        }
    },
    bank_fee_rate_log: {
        type: type_fee_rate_log,
        args: {
            chi_nhanh_bank_id: {
                type: GraphQLInt
            },
            loai_hinh_kd_id: {
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
            if (args.loai_hinh_kd_id) {
                condition += ` and f.loai_hinh_kd_id = ${args.loai_hinh_kd_id}`;
            }
            if (args.loai_the_id) {
                condition += ` and f.loai_the_id = ${args.loai_the_id}`;
            }
            delete args.page_size
            delete args.page_index
            let baseQuery = `select t.* from dvkd_fee_rate_log t join dvkd_fee_rate f on f.id = t.dvkd_fee_rate_id where t.chi_nhanh_bank_id = ${args.chi_nhanh_bank_id} ${condition}`
            let groupQuery = ` group by t.id`
            let items = await FeeRateLog.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
}