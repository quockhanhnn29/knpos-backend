const type = require('./type_fee_rate_log')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'BankFeeRateLogCustom',
    description: 'A Bank Branch Fee Rate Log Custom',
    fields: {
        items:  {
            type: new GraphQLList(type)
        },
        total_item: {
            type: GraphQLInt
        }
    }
})