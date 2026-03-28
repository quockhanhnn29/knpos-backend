const { GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean } = require('graphql')
const type_custom = require('./type_custom')
const MerchantChecklist = require('./merchant_checklist')

// Defines the queries
module.exports = {
    merchant_checklist: {
        type: type_custom,
        args: {
            id: {
                type: GraphQLID
            },
            merchant_status: {
                type: new GraphQLList(GraphQLInt)
            },
            loai_hinh_kd_id: {
                type: new GraphQLList(GraphQLInt)
            },
            bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            chi_nhanh_bank_id: {
                type: new GraphQLList(GraphQLInt)
            },
            page_size: {
                type: GraphQLInt
            },
            page_index: {
                type: GraphQLInt
            }
        },
        resolve: async (_, args, context, info) => {
            let limit = args.page_size;
            let offset = (args.page_index - 1) * args.page_size;
            limit = limit > 0 ? limit : 200;
            offset = offset >= 0 ? offset : 0;
            let baseQuery = `select t.* from merchant_checklist t 
            where t.status = 0 and t.merchant_status IN (${args.merchant_status}) and t.loai_hinh_kd_id IN (${args.loai_hinh_kd_id}) 
            and t.bank_id IN (${args.bank_id})`
            if (args.chi_nhanh_bank_id) {
                baseQuery += ` and (t.chi_nhanh_bank_id is null or t.chi_nhanh_bank_id IN (${args.chi_nhanh_bank_id}))`;
            }
            let groupQuery = ` group by t.id ORDER BY merchant_status ASC, sort_order ASC`
            let items = await MerchantChecklist.findByFields2({baseQuery, groupQuery, alias: 't.', fields: [], limit, offset, order: null})
            return {total_item: items.length, items}
        }
    }
}