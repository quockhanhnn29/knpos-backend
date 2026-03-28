let {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')
module.exports = new GraphQLObjectType({
  name: 'MerchantReport',
  description: 'A Merchant report basic object',
  fields: {
    agent_id: {
      type: GraphQLInt
    },
    agent_name: {
      type: GraphQLString
    },
    status: {
      type: GraphQLInt
      // 0: total, 1: kn_process (0,1), 2: bank_process (2), 3: applied (3), 4: running (4), 5: closed (5,7), 6: denied (6)
    },
    value: {
      type: GraphQLInt
    }
  }
})