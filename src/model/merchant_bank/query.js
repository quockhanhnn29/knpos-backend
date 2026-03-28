const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const MerchantBank = require("./merchant_bank")

// Defines the queries
module.exports = {
    merchant_banks: {
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
            kn_office_id: {
                type: new GraphQLList(GraphQLInt)
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
            limit = limit > 0 ? limit : 50000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            let baseQuery = `select mb.* from merchant_bank mb join merchant m on m.id = mb.merchant_id where mb.tid is not null and mb.soft_deleted = 0 and m.kn_office_id IN (${args.kn_office_id})`;
            let groupQuery = ` group by mb.tid, mb.id`;
            let items = await MerchantBank.findByFields2({baseQuery, groupQuery, alias: 'mb.', fields: [], limit, offset, order})
            let total_item = items.length;
            return {total_item, items}
        }
    },
    merchant_bank: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await MerchantBank.findOne(_, [], args)
        }
    }
}