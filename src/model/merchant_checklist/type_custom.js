const type = require('./type')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'MerchantChecklistCustom',
    description: 'Merchant\'s Checklist by Business type',
    fields: {
        items:  {
            type: new GraphQLList(type)
        },
        total_item: {
            type: GraphQLInt
        }
    }
})