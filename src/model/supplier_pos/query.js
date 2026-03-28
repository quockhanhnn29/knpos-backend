const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const SupplierPos = require('./supplier_pos')

// Defines the queries
module.exports = {
    suppliers: {
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
            limit = limit > 0 ? limit : 1000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let baseQuery = `select t.* from supplier_pos t where t.status = 0 and t.soft_deleted = 0`
            let groupQuery = ` group by t.id`
            let items = await SupplierPos.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    }
}