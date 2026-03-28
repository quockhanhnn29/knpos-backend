const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const PosContract = require("./pos_contract")

// Defines the queries
module.exports = {
    pos_contracts: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            so_hd: {
                type: GraphQLString
            },
            supplier_id: {
                type: GraphQLInt
            },
            loai_may_id: {
                type: new GraphQLList(GraphQLInt)
            },
            provider_id: {
                type: new GraphQLList(GraphQLInt)
            },
            status: {
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
            if (args.so_hd) {
                condition += ` and LOWER(c.so_hd) LIKE '%${args.so_hd.toLowerCase()}%'`;
            }
            if (args.supplier_id) {
                condition += ` and c.supplier_id = ${args.supplier_id}`;
            }
            if (args.loai_may_id) {
                condition += ` and c.loai_may_id IN (${args.loai_may_id})`;
            }
            if (args.provider_id) {
                condition += ` and c.provider_id IN (${args.provider_id})`;
            }
            let baseQuery = `select c.*, p.ten as provider_name, s.ten as supplier, m.ten as model from pos_contract c 
            left join pos on pos.contract_id = c.id 
            left join pos_provider p on p.id = c.provider_id 
            left join supplier_pos s on s.id = c.supplier_id 
            left join supplier_pos_model m on m.id = c.loai_may_id 
            where c.soft_deleted = 0 ${condition}`;
            let groupQuery = ` group by c.id`
            let items = await PosContract.findByFields2({baseQuery, groupQuery, alias: 'c.', fields: [], limit, offset, order})
            let total_items = await PosContract.findByFields2({baseQuery, groupQuery, alias: 'c.', fields: [], limit: null, offset: null, order})
            if (total_items && total_items.length > 0) {
                return {
                    total_item: total_items.length, 
                    items
                }
            } else return {
                total_item: 0,
                items: []
            }
        }
    },
    pos_contract: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            // make sure user is authenticated
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            return await PosContract.findOne(_, [], args)
        }
    }
}