let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'user_tag',
    description: 'A user tag',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        user_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        tag_id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
})