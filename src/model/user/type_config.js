let {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Config',
  description: 'Web common config value',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    meta_key: {
      type: GraphQLString
    },
    meta_value: {
      type: GraphQLString
    },
    soft_deleted: {
      type: GraphQLInt
    },
  }
})