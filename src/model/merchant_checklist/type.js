let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantChecklist',
    description: 'Merchant\'s Checklist by Business type',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        merchant_status: {
            type: GraphQLInt
        },
        loai_hinh_kd_id: {
            type: GraphQLInt
        },
        bank_id: {
            type: GraphQLInt
        },
        chi_nhanh_bank_id: {
            type: GraphQLInt
        },
        text: {
            type: GraphQLString
        },
        checklist_description: {
            type: GraphQLString
        },
        status: {
            type: GraphQLInt
        },
        required:{
            type: GraphQLInt
        },
        has_description: {
            type: GraphQLInt
        },
        description_label: {
            type: GraphQLString
        },
        has_attachment: {
            type: GraphQLInt
        },
        attachment_label: {
            type: GraphQLString
        },
        sort_order: {
            type: GraphQLInt
        }
    }
})