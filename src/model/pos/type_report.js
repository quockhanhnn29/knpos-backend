let {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')
module.exports = new GraphQLObjectType({
  name: 'PosReport',
  description: 'A Pos report basic object',
  fields: {
    pos_model_id: {
      type: GraphQLInt
    },
    pos_model: {
      type: GraphQLString
    },
    status: {
      type: GraphQLInt
      // 0: total, 1: sẵn (0), 2: đã đăng ký (1), 3: đã cấp (2), 4: đang thu hồi (5), 5: hỏng (3), 6: hoàn trả (4)
    },
    value: {
      type: GraphQLInt
    }
  }
})