let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'MerchantAttachment',
    description: 'Merchant\'s Attachment by Checklist process',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        checklist_process_id: {
            type: GraphQLInt
        },
        attachments: {
            type: GraphQLString
        },
        file_name: {
            type: GraphQLString
        },
        created_date: {
            type: GraphQLString
        },
        uploaded_by: {
            type: GraphQLInt
        },
        status: {
            type: GraphQLInt
        }
    }
})