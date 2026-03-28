const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const Category = require("./category")
const graphqlFields = require('graphql-fields')
const lodash = require('lodash')

// Defines the queries
module.exports = {
    categories: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            category_name: {
                type: GraphQLString
            },
            quick_search: {
                type: GraphQLString
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
            // make sure user is authenticated
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
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
            lodash.remove(columns, n => {
                return n === 'number_user'
            })
            let total_item = await Category.totalRow({fields: args})
            //let items = await Category.findMatching(_, columns, args, limit, offset, order)
            let baseQuery = `select c.id, c.category_name, c.description, c.parent_id, count(uc.id) as number_user from categories c left join user_category uc on c.id = uc.category_id `
            let groupQuery = ` group by c.id, c.category_name, c.description, c.parent_id `
            let items = await Category.findByFields2({baseQuery, groupQuery, alias: 'c.', fields: args, limit, offset, order})
            return {total_item, items}
        }
    },
    category: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context, info) => {            
            // make sure user is authenticated
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            return await Category.findOne(_, [], args)
        }
    }
}