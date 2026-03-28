const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type = require('./type')
const type_custom = require('./type_custom')
const Client = require("./client")

// Defines the queries
module.exports = {
    clients: {
        type: type_custom,
        args: {
            quick_search: {
                type: GraphQLString
            },
            kn_office_id: {
                type: GraphQLInt
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
        resolve: async (_, args, context) => {
            // make sure user is authenticated
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 1000;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column || 'ten',
                direction: args.order_direction ? 'DESC' : 'ASC'
            }
            let condition = '';
            if (args.quick_search) {
                let string = args.quick_search.toLowerCase();
                condition += ` and (LOWER(a.ten) LIKE '%${string}%' OR LOWER(a.chu_ho_kd) LIKE '%${string}%' OR LOWER(a.maso) = '${string}' OR LOWER(a.maso_dk) = '${string}')`;
            }
            if (args.kn_office_id) {
                condition += ` and (m.kn_office_id = ${args.kn_office_id} or m.kn_office_id = 0 or m.kn_office_id is null)`;
            }
            let baseQuery = `select a.* from client a left join merchant m on m.client_id = a.id where a.soft_deleted = 0 and a.status = 0 ${condition}`;
            let groupQuery = ` group by a.id, a.maso, a.maso_dk`;
            let items = await Client.findByFields2({baseQuery, groupQuery, alias: 'a.', fields: [], limit, offset, order})
            let total_items = await Client.findByFields2({baseQuery, groupQuery, alias: 'a.', fields: [], limit: null, offset: null, order})
            let total_item = total_items.length;
            return {total_item, items}
        }
    },
    client: {
        type,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve: async (_, args, context) => {
            return await Client.findOne(_, [], args)
        }
    },
}