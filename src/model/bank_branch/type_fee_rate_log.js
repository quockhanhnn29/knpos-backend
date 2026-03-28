let {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql')
const User = require('../user/user')
module.exports = new GraphQLObjectType({
  name: 'BankFeeRateLog',
  description: 'A Fee Rate Log For Bank Branch',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    dvkd_fee_rate_id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    chi_nhanh_bank_id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    thong_tin_cu: {
      type: GraphQLString,
    },
    thong_tin_moi: {
      type: GraphQLString,
    },
    timestamp: {
      type: GraphQLString
    },
    user_id: {
      type: GraphQLInt
    },
    user_name: {
      type: GraphQLString,
      resolve: async(obj) => {
          let user = await User.executeQueryString(`select u.* from dvkd_fee_rate_log m join users u on u.id = m.user_id where u.id = ${ obj.user_id }`)
          return user && user.length ? user[0].user_name : '';
      }
    },
  }
})