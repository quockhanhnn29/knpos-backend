const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const MerchantBankAccountLog = require('./merchant_bank_account_log')
const lodash = require('lodash');

// Defines the queries
module.exports = {
    merchant_bank_account_logs: {
        type: type_custom,
        args: {
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
        resolve: async (_, args, context) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 5000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: 'timestamp',
                direction: 'DESC'
            }
            delete args.page_size
            delete args.page_index
            delete args.order_column
            delete args.order_direction
            let baseQuery = `select t.* from merchant_bank_account_log t`
            let groupQuery = ` group by t.id`
            let items = await MerchantBankAccountLog.findByFields2({baseQuery, groupQuery, alias: 't.', fields: args, limit, offset, order})
            return {total_item: items.length, items}
        }
    }
}