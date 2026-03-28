const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const type = require('./type')
const MerchantAttachment = require('./merchant_attachments')
const {UserRoleEnumType} = require('../user_role/enums')


// Defines the mutations
module.exports = {}