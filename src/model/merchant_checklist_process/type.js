let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
const MerchantAttachment = require('../merchant_attachments/merchant_attachments')
module.exports = new GraphQLObjectType({
    name: 'MerchantChecklistProcess',
    description: 'Merchant\'s Checklist Process',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        checklist_id: {
            type: GraphQLInt
        },
        merchant_id: {
            type: GraphQLInt
        },
        description: {
            type: GraphQLString
        },
        attachments: {
            type: GraphQLString,
            resolve: async (obj) => {
                let a = await MerchantAttachment.executeQueryString(`select a.* from merchant_attachment a where a.status = 0 and a.checklist_process_id = ${obj.id}`);
                return a && a.length ? a[0].attachments : '';
            }
        },
        status: {
            type: GraphQLInt
            // 0 - not completed, 1 - completed
        },
        modified_date: {
            type: GraphQLString
        },
        modified_by: {
            type: GraphQLInt
        }
    }
})