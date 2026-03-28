const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const MerchantAttachment = require('./merchant_attachments')

// Defines the queries
module.exports = {
    merchant_attachments: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            merchant_id: {
                type: GraphQLInt
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
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            delete args.page_size
            delete args.page_index
            delete args.order_column
            delete args.order_direction
            args.status = 1;
            let total_item = await MerchantAttachment.totalRow({fields: args})
            let baseQuery = `select t from merchant_attachment t`
            let groupQuery = ` group by t.id`
            let items = await MerchantAttachment.findByFields2({baseQuery, groupQuery, alias: 't.', fields: args, limit, offset, order})
            return {total_item, items}
        }
    }
}