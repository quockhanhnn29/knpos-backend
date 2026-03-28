const type_pie = require('./type_chart')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'TransactionChartCustom',
    description: 'A Transaction Chart Custom Data',
    fields: {
        items: {
            type: new GraphQLList(type_pie)
        }
    }
})