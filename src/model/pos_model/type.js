let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'SupplierPosModel',
    description: 'A Pos model by supplier',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        supplier_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten: {
            type: GraphQLString
        },
        status: {
            type: GraphQLInt
        }
    }
})