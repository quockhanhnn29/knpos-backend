const type = require('./type_fee_rate')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'BankFeeRateCustom',
    description: 'A Bank Branch Fee Rate Custom',
    fields: {
        items:  {
            type: new GraphQLList(type)
        },
        total_item: {
            type: GraphQLInt
        }
    }
})