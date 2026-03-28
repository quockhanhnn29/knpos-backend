const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
let lodash = require('lodash')
const type = require('./type')
const type_custom = require('./type_custom')
const type_config_custom = require('./type_config_custom')
const User = require("./user")
const WebConfig = require("./config")
const graphqlFields = require('graphql-fields');

// Defines the queries
module.exports = {
    users: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            email: {
                type: GraphQLString
            },
            user_name: {
                type: GraphQLString
            },
            quick_search: {
                type: GraphQLString
            },
            role_id: {
                type: new GraphQLList(GraphQLInt)
            },
            kn_office_id: {
                type: GraphQLInt
            },
            category_id: {
                type: new GraphQLList(GraphQLInt)
            },
            tag_id: {
                type: new GraphQLList(GraphQLInt)
            },
            status: {
                type: new GraphQLList(GraphQLInt)
            },
            page_size: {
                type: GraphQLInt
            },
            page_index: {
                type: GraphQLInt
            },
            order_column: {
                type: GraphQLString
            },
            order_direction: {
                type: GraphQLBoolean
            }
        },
        resolve: async (_, args, context, info) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 5;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            delete args.page_size
            delete args.page_index
            delete args.order_column
            delete args.order_direction
            const columns = Object.keys(graphqlFields(info).items)
            lodash.remove(columns, (col) => {
                return col == 'user_role' || col == 'user_tag' || col == 'user_category'
            })
            let condition = ''
            let params = []
            if (args.role_id) {
                condition += ` and ur.role_id in (?) `
                params.push(args.role_id)
                delete args.role_id
            }
            if (args.tag_id) {
                condition += ` and ut.tag_id in (?) `
                params.push(args.tag_id)
                delete args.tag_id
            }
            if (args.category_id) {
                condition += ` and uc.category_id in (?) `
                params.push(args.category_id)
                delete args.category_id
            }
            if (condition != '') {
                let query = `select distinct u.id from users u
                        left join user_category uc on u.id = uc.user_id
                        left join user_tag ut on u.id = ut.user_id
                        left join user_role ur on u.id = ur.user_id
                        where 1 = 1 ${condition} `
                const userIds = await User.executeQueryString2(query, params)
                let ids = []
                userIds.map(item => {
                    ids.push(item.id)
                })
                if (ids.length == 0) return null
                args.id = ids
            }
            args.soft_deleted = 0;
            const items = await User.findMatching(_, columns, args, limit, offset, order)
            const total_item = await User.totalRow({fields: args})
            return {items, total_item}
        }
    },
    user: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await User.findOne(_, [], args)
        }
    },
    web_configs: {
        type: type_config_custom,
        args: {},
        resolve: async (_, args, context) => {
            let baseQuery = `select t.* from web_config t where t.soft_deleted = 0`
            let groupQuery = ` group by t.id`
            let items = await WebConfig.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit: 100, offset: 0, order: null})
            return {total_item: items.length, items}
        }
    }
}