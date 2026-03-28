const type = require('./type')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'TransactionCustom',
    description: 'A Transaction Custom',
    fields: {
        total_item: {
            type: GraphQLInt
        },
        items:  {
            type: new GraphQLList(type)
        },
        so_gd_total: {
            type: GraphQLInt
        },
        total_value_gd: {
            type: GraphQLString
        },
        total_value_bc: {
            type: GraphQLString
        },
        total_value_phi: {
            type: GraphQLString
        },
    }
})