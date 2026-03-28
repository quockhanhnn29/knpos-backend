let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
const UserTag = require('../user_tag/user_tag')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'tags',
    description: 'A tag',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        tag_name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: GraphQLString
        },
        parent_id: {
            type: GraphQLInt
        },
        number_user: {
            type: GraphQLInt,
            resolve: async(obj) => {
                var userTag = await UserTag.executeQueryString(`select id from user_tag where tag_id = ${obj.id}`)
                return userTag.length
            }
        }
    }
})