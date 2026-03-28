const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const Agent = require("./agent")
const type_fee_rate_single = require('./type_fee_rate')
const type_fee_rate = require('./type_fee_rate_custom')
const type_fee_rate_log = require('./type_fee_rate_log_custom')
const FeeRate = require("./fee_rate")
const FeeRateLog = require("./fee_rate_log")

// Defines the queries
module.exports = {
    agents: {
        type: type_custom,
        args: {
            quick_search: {
                type: GraphQLString
            },
            kn_office_id: {
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
        resolve: async (_, args, context) => {            
            // make sure user is authenticated
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
                condition += ` and LOWER(a.ten_dai_ly) LIKE '%${string}%'`;
            }
            if (args.kn_office_id && args.kn_office_id.length > 0) {
                let kn_office_id = '';
                args.kn_office_id.forEach(t => {
                    kn_office_id += `,${t}`;
                });
                kn_office_id = kn_office_id.replace(',', '');
                condition += ` and a.kn_office_id IN (${kn_office_id})`;
            }
            let baseQuery = `select a.* from agent a where a.soft_deleted = 0 ${condition}`;
            let groupQuery = ` group by a.id`;
            let items = await Agent.findByFields2({baseQuery, groupQuery, alias: 'a.', fields: [], limit, offset, order})
            let total_item = items.length;
            return {total_item, items}
        }
    },
    agent: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await Agent.findOne(_, [], args)
        }
    },
    agent_fee_rate: {
        type: type_fee_rate,
        args: {
            agent_id: {
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
            let baseQuery = `select t.* from agent_fee_rate t where t.soft_deleted = 0 and t.agent_id = ${args.agent_id}`
            let groupQuery = ` group by t.id`
            let items = await FeeRate.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
    selected_agent_fee_rate: {
        type: type_fee_rate_single,
        args: {
            agent_id: {
                type: GraphQLInt
            },
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
    agent_fee_rate_log: {
        type: type_fee_rate_log,
        args: {
            agent_id: {
                type: GraphQLInt
            },
            bank_id: {
                type: GraphQLInt
            },
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
            if (args.bank_id) {
                condition += ` and b.bank_id = ${args.bank_id}`;
            }
            if (args.chi_nhanh_bank_id) {
                condition += ` and f.chi_nhanh_bank_id = ${args.chi_nhanh_bank_id}`;
            }
            if (args.loai_hinh_kd_id) {D
                condition += ` and f.loai_hinh_kd_id = ${args.loai_hinh_kd_id}`;
            }
            if (args.loai_the_id) {
                condition += ` and f.loai_the_id = ${args.loai_the_id}`;
            }
            delete args.page_size
            delete args.page_index
            let baseQuery = `select t.* from agent_fee_rate_log t join agent_fee_rate f on f.id = t.agent_fee_rate_id join bank_branch b on b.id = f.chi_nhanh_bank_id where t.agent_id = ${args.agent_id} ${condition}`
            let groupQuery = ` group by t.id`
            let items = await FeeRateLog.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
}