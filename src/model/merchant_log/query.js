const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const MerchantLog = require('./merchant_log')
const MerchantChecklistProcess = require('../merchant_checklist_process/merchant_checklist_process')
const lodash = require('lodash');

// Defines the queries
module.exports = {
    merchant_logs: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            merchant_id: {
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
        resolve: async (_, args, context, info) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 100;
            offset = offset >= 0 ? offset : 0;
            let order = {
                by: args.order_column,
                direction: args.order_direction ? 'ASC' : 'DESC'
            }
            delete args.page_size
            delete args.page_index
            delete args.order_column
            delete args.order_direction
            let baseQuery = `select t.* from merchant_log t`
            let groupQuery = ` group by t.id`
            let items = await MerchantLog.findByFields2({baseQuery, groupQuery, alias: 't.', fields: args, limit, offset, order})
            let checklist_process = await MerchantChecklistProcess.executeQueryString(`select c.text, c.description_label, c.sort_order, u.user_name, p.modified_date, p.modified_by, p.description, a.attachments from merchant_checklist_process p 
                join merchant_checklist c on p.checklist_id = c.id 
                left join merchant_attachment a on a.checklist_process_id = p.id
                left join users u on p.modified_by = u.id
                where p.status = 1 and p.merchant_id = ${args.merchant_id}`);
            if (checklist_process && checklist_process.length) {
                checklist_process.forEach(c => {
                    items.push({
                        merchant_id: c.merchant_id,
                        user_id: c.modified_by,
                        user_name: c.user_name, 
                        sort_order: c.sort_order,
                        activity_type: c.text, 
                        description: c.description ? c.description_label + ': ' + c.description : '', 
                        timestamp: c.modified_date,
                        attachments: c.attachments
                    })
                });
            }
            return {total_item: items.length, items}
        }
    }
}