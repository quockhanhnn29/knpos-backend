let {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql')
module.exports = new GraphQLObjectType({
  name: 'BankBranchCard',
  description: 'A Bank Branch Card Config',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    chi_nhanh_bank_id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    ten_the: {
      type: GraphQLString
    },
    ten_doi_soat: {
      type: GraphQLString
    },
    status: {
      type: GraphQLInt
    },
    soft_deleted: {
      type: GraphQLInt
    },
    created_date: {
      type: GraphQLString
    },
    modified_date: {
      type: GraphQLString
    },
    modified_by: {
      type: GraphQLInt
    }
  }
})