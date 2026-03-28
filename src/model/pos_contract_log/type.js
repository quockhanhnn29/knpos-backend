let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const User = require('../user/user')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'PosContractLog',
    description: 'A pos contract log',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        contract_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        user_id: {
            type: GraphQLInt
        },
        user_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let user = await User.executeQueryString(`select u.* from pos_contract_log m join users u on u.id = m.user_id where u.id = ${ obj.user_id }`)
                return user && user.length ? user[0].user_name : '';
            }
        },
        activity_type: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        timestamp: {
            type: GraphQLString
        },
        attachments: {
            type: GraphQLString
        },
    }
})