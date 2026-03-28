let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'offices',
    description: 'An office',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        office_name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        office_address: {
            type: GraphQLString
        },
        status: {
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