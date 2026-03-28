let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
// Defines the type
const User = require('../user/user')
module.exports = new GraphQLObjectType({
    name: 'MerchantBankPos',
    description: 'A Merchant Bank Pos',
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
        pos_id: {
            type: GraphQLInt
        },
        user_id_ban_giao: {
            type: GraphQLInt
        },
        user_ban_giao: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await User.executeQueryString(`select * from users where id = ${ obj.user_id_ban_giao }`);
                return c && c.length ? c[0].user_name : '';
            }
        },
        ngay_ban_giao: {
            type: GraphQLString
        },
        user_id_thu_hoi: {
            type: GraphQLInt
        },
        user_thu_hoi: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await User.executeQueryString(`select * from users where id = ${ obj.user_id_thu_hoi }`);
                return c && c.length ? c[0].user_name : '';
            }
        },
        ngay_thu_hoi: {
            type: GraphQLString
        },
        ly_do_thu_hoi: {
            type: GraphQLInt
        },
        status: {
            type: GraphQLInt
            // 0 - Chờ, 1 - Đã cấp, 2 - Thu hồi
        },
        soft_deleted: {
            type: GraphQLBoolean
        },
        modified_by: {
            type: GraphQLInt
        }
    }
})