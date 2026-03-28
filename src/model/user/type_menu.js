let {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Menu',
  description: 'A menu object',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    route: {
      type: GraphQLString
    },
    display_name: {
      type: GraphQLString
    },
    menu_icon: {
      type: GraphQLString
    },
    parent_id: {
      type: GraphQLInt
    },
    sort_order: {
      type: GraphQLInt
    },
    status: {
      type: GraphQLInt
    },
    is_default: {
      type: GraphQLInt
    },
    permission: {
      type: GraphQLInt
    }
  }
})