let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
const UserCategory = require('../user_category/user_category')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'categories',
    description: 'A category',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        category_name: {
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
                var userCategory = await UserCategory.executeQueryString(`select id from user_category where category_id = ${obj.id}`)
                return userCategory.length
            }
        }
    }
})