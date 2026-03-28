const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const MerchantBusType = require('./merchant_type')

// Defines the queries
module.exports = {
    merchant_type: {
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
        resolve: async (_, args, context, info) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 100;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: 'id',
                direction: 'ASC'
            }
            let baseQuery = `select t.* from merchant_bus_type t where t.status = 0`
            let groupQuery = ` group by t.id`
            let items = await MerchantBusType.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order})
            return {total_item: items.length, items}
        }
    }
}