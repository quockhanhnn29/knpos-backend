const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const Bank = require("./bank")

// Defines the queries
module.exports = {
    banks: {
        type: type_custom,
        args: {
            id: {
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
            limit = limit > 0 ? limit : 50;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let baseQuery = `select a.* from bank a where a.status = 0 and a.soft_deleted = 0`;
            let groupQuery = ` group by a.id`;
            let items = await Bank.findByFields2({baseQuery, groupQuery, alias: 'a.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    },
    bank: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await Bank.findOne(_, [], args)
        }
    }
}