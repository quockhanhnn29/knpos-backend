const type = require('./type')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'PosProviderCustom',
    description: 'Pos Providers Custom',
    fields: {
        items:  {
            type: new GraphQLList(type)
        },
        total_item: {
            type: GraphQLInt
        }
    }
})