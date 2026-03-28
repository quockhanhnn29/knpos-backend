let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Bank',
    description: 'A Bank',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten_bank: {
            type: GraphQLString
        },
        ngay_ky_ket: {
            type: GraphQLString
        },
        ho_so_file: {
            type: GraphQLString
        },
        status: {
            type: GraphQLInt
        },
        soft_deleted: {
            type: GraphQLBoolean
        },
        modified_by: {
            type: GraphQLInt
        }
    }
})