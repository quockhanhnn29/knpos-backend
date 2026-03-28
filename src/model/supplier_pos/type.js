let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'SupplierPos',
    description: 'A Pos supplier',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten: {
            type: GraphQLString
        },
        dia_chi: {
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