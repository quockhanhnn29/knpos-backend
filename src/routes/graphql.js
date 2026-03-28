const graphqlHTTP = require('express-graphql')
const router = require('express').Router()
const util = require('../util/util')
const schema = require('../schema/index')
require('dotenv').config()
const {UserRoleEnumType} = require('../model/user_role/enums')

router.get('/', graphqlHTTP(req => ({
    schema,
    graphiql: !util.isProduction(),
    context: {
      user: req.user,
      ip: req.ip,
      fullUrl: 'https://' + req.get('host'), //req.protocol + '://' + req.get('host'),
      isSuperAdmin: req.user && req.user.role_ids && req.user.role_ids.includes(UserRoleEnumType.SUPER_ADMIN),
      isAdmin: req.user && req.user.role_ids && req.user.role_ids.includes(UserRoleEnumType.ADMIN),
      isGuestManager: req.user && req.user.role_ids && req.user.role_ids.includes(UserRoleEnumType.GUEST_MANAGER),
      token: req.headers["authorization"]
    }
  })))

router.post('/', graphqlHTTP(req => ({
    schema,
    graphiql: false,
    context: {
      user: req.user,
      ip: req.ip,
      fullUrl: 'https://' + req.get('host'), //req.protocol + '://' + req.get('host'),
      isSuperAdmin: req.user && req.user.role_ids && req.user.role_ids.includes(UserRoleEnumType.SUPER_ADMIN),
      isAdmin: req.user && req.user.role_ids && req.user.role_ids.includes(UserRoleEnumType.ADMIN),
      isGuestManager: req.user && req.user.role_ids && req.user.role_ids.includes(UserRoleEnumType.GUEST_MANAGER),
      token: req.headers["authorization"]
    }
  })))

module.exports = router
