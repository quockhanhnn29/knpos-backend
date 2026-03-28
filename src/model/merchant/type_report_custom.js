const type = require('./type_report')
let {
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} = require('graphql');
module.exports = new GraphQLObjectType({
    name: 'MerchantReportCustom',
    description: 'A Merchant Report Custom Object',
    fields: {
        items_kn_hn:  {
            type: new GraphQLList(type)
        },
        items_kn_hcm:  {
          type: new GraphQLList(type)
      },
    }
})