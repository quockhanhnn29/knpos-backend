let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const Pos = require('../pos/pos')
const MerchantBankPos = require('../merchant_bank_pos/merchant_bank_pos')
const MerchantBankPosType = require('../merchant_bank_pos/type')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantBank',
    description: 'A Merchant Bank',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        merchant_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        pos_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        bank_id: {
            type: GraphQLInt
        },
        pos_seri: {
            type: GraphQLString,
            resolve: async(obj) => {
                let s = await Pos.executeQueryString(`select s.* from pos s where s.id = ${ obj.pos_id }`)
                return s && s.length ? s[0].seri : '';
            }
        },
        loai_may: {
            type: GraphQLString,
            resolve: async(obj) => {
                let s = await Pos.executeQueryString(`select s.* from pos p join supplier_pos_model s on p.loai_may_id = s.id where p.id = ${ obj.pos_id }`)
                return s && s.length ? s[0].ten : '';
            }
        },
        ten_hkd_bank: {
            type: GraphQLString
        },
        mid: {
            type: GraphQLString
        },
        tid: {
            type: GraphQLString
        },
        ngay_ra_ts: {
            type: GraphQLString
        },
        merchant_bank_pos: {
            type: MerchantBankPosType,
            resolve: async(obj) => {
                return await MerchantBankPos.findOne(obj, [], {merchant_bank_id: obj.id, pos_id: obj.pos_id})
            }
        },
        status: {
            type: GraphQLInt
            // 0 - Chờ, 1 - Đã cấp, 2 - Thu hồi, 3 - Đóng
        },
        soft_deleted: {
            type: GraphQLBoolean
        },
        modified_by: {
            type: GraphQLInt
        }
    }
})