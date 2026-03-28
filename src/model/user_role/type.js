let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'user_role',
    description: 'A user role',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        user_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        role_id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
})