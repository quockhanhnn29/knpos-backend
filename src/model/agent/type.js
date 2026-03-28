let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Agent',
    description: 'An Agent',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten_dai_ly: {
            type: GraphQLString
        },
        ten_dai_dien: {
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
        ngay_bat_dau: {
            type: GraphQLString
        },
        ngay_ket_thuc: {
            type: GraphQLString
        },
        hop_dong: {
            type: GraphQLString
        },
        kn_office_id: {
            type: GraphQLInt
        },
        status: {
            type: GraphQLInt
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
        }
    }
})