let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
const User = require('../user/user')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantLog',
    description: 'Merchant\'s Log',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        merchant_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        user_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        sort_order: {
            type: GraphQLInt
        },
        user_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let user = await User.executeQueryString(`select u.* from merchant_log m join users u on u.id = m.user_id where u.id = ${ obj.user_id }`)
                return user && user.length ? user[0].user_name : '';
            }
        },
        activity_type: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        attachments: {
            type: GraphQLString
        },
        timestamp: {
            type: GraphQLString
        },
    }
})