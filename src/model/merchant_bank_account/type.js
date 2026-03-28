let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const MerchantBankType = require('../merchant_bank/type')
const MerchantBank = require('../merchant_bank/merchant_bank')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantBankAccount',
    description: 'A Merchant Bank Account',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        merchant_id: {
            type: GraphQLInt
        },
        merchant_bank_id: {
            type: GraphQLInt
        },
        merchant_bank: {
            type: MerchantBankType,
            resolve: async(obj) => {
                return await MerchantBank.findOne(obj, [], {id: obj.merchant_bank_id})
            }
        },
        chu_tk: {
            type: GraphQLString
        },
        stk: {
            type: GraphQLString
        },
        ngan_hang: {
            type: GraphQLString
        },
        chi_nhanh: {
            type: GraphQLString
        },
        email_bc: {
            type: GraphQLString
        },
        thoi_gian_hl: {
            type: GraphQLString
        },
        ca_hl: {
            type: GraphQLString
        },
        modified_date: {
            type: GraphQLString
        },
        modified_by: {
            type: GraphQLInt
        },
    }
})