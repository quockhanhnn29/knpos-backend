const type = require('./type')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'BankBranchCustom',
    description: 'A Bank Branch Custom',
    fields: {
        items:  {
            type: new GraphQLList(type)
        },
        total_item: {
            type: GraphQLInt
        }
    }
})