let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const MerchantBus = require('../merchant_type/merchant_type')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Client',
    description: 'A Client',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten: {
            type: GraphQLString
        },
        type: {
            type: GraphQLInt
        },
        maso: {
            type: GraphQLString
        },
        maso_dk: {
            type: GraphQLString
        },
        ngay_cap_dk: {
            type: GraphQLString
        },
        noi_cap_dk: {
            type: GraphQLString
        },
        diachi_kinhdoanh: {
            type: GraphQLString
        },
        quan_huyen: {
            type: GraphQLString
        },
        tinh_tp: {
            type: GraphQLString
        },
        loai_hinh_kd: {
            type: GraphQLInt
        },
        ten_loai_hinh_kd: {
            type: GraphQLString,
            resolve: async(obj) => {
                let t = await MerchantBus.executeQueryString(`select a.* from merchant_bus_type a where a.id = ${ obj.loai_hinh_kd }`)
                return t && t.length ? t[0].ten : '';
            }
        },
        chu_ho_kd: {
            type: GraphQLString
        },
        gioi_tinh: {
            type: GraphQLString
        },
        ngay_sinh: {
            type: GraphQLString
        },
        so_cccd: {
            type: GraphQLString
        },
        ngay_cap: {
            type: GraphQLString
        },
        noi_cap: {
            type: GraphQLString
        },
        dia_chi: {
            type: GraphQLString
        },
        sdt: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        status: {
            type: GraphQLInt
            // 0 - active; 1 - deactive
        },
        soft_deleted: {
            type: GraphQLBoolean
        },
        created_date: {
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