const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const MerchantChecklistProcess = require('./merchant_checklist_process')

// Defines the queries
module.exports = {
    merchant_checklist: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            merchant_status: {
                type: GraphQLInt
            },
            loai_hinh_kd_id: {
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
                by: 'sort_order',
                direction: 'ASC'
            }
            delete args.page_size
            delete args.page_index
            delete args.order_column
            delete args.order_direction
            args.status = 0;
            let total_item = await MerchantChecklistProcess.totalRow({fields: args})
            let baseQuery = `select t.* from merchant_checklist t`
            let groupQuery = ` group by t.id`
            let items = await MerchantChecklistProcess.findByFields2({baseQuery, groupQuery, alias: 't.', fields: args, limit, offset, order})
            return {total_item, items}
        }
    }
}