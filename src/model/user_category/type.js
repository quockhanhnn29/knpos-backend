let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'user_category',
    description: 'A user category',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        user_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        category_id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
})