let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
const User = require('../user/user')
const MerchantBank = require('../merchant_bank/merchant_bank')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantBankAccountLog',
    description: 'Merchant\'s Bank Account Log',
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
            type: GraphQLString,
            resolve: async(obj) => {
                let mb = await MerchantBank.findOne(obj, [], {id: obj.merchant_bank_id});
                if (mb && mb.mid) {
                    return mb.ten_hkd_bank ? mb.ten_hkd_bank + ' - ' + mb.mid : mb.mid
                } else {
                    return '';
                }
            }
        },
        thong_tin_cu: {
            type: GraphQLString
        },
        thong_tin_moi: {
            type: GraphQLString
        },
        timestamp: {
            type: GraphQLString
        },
        user_id: {
            type: GraphQLInt
        },
        user_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let user = await User.executeQueryString(`select u.* from merchant_log m join users u on u.id = m.user_id where u.id = ${ obj.user_id }`)
                return user && user.length ? user[0].user_name : '';
            }
        },
    }
})