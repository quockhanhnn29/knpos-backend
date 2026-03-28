let {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'TransactionChart',
    description: 'A Transaction Chart Data',
    fields: {
        date_from: {
            type: GraphQLString
        },
        date_to: {
            type: GraphQLString
        },
        agent: {
            type: GraphQLString
        },
        so_gd: {
            type: GraphQLInt
        },
        tong_gd: {
            type: GraphQLString
        },
        tong_bc: {
            type: GraphQLString
        },
        tong_phi: {
            type: GraphQLString
        },
    }
})