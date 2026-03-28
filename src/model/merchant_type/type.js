let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantBusType',
    description: 'Merchant\'s Business type',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten: {
            type: GraphQLString
        },
        status: {
            type: GraphQLInt
        },
    }
})