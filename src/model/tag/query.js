const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const Tag = require("./tag")
const graphqlFields = require('graphql-fields')
const lodash = require('lodash')

// Defines the queries
module.exports = {
    tags: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            tag_name: {
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
            let total_item = await Tag.totalRow({fields: args})
            //let items = await Tag.findMatching(_, columns, args, limit, offset, order)
            let baseQuery = `select t.id, t.description, t.parent_id, t.tag_name, count(ut.user_id) as number_user from tags t left join user_tag ut on t.id = ut.tag_id `
            let groupQuery = ` group by t.id, t.description, t.parent_id, t.tag_name`
            let items = await Tag.findByFields2({baseQuery, groupQuery, alias: 't.', fields: args, limit, offset, order})
            return {total_item, items}
        }
    },
    tag: {
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
            return await Tag.findOne(_, [], args)
        }
    }
}