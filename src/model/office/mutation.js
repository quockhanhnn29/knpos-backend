const {
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const Office = require('./office')


// Defines the mutations
module.exports = {
    addOffice: {
        type,
        args: {
            office_name: { type: GraphQLString },
            office_address: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            
            const office = await Office.createEntry(_, {
                office_name: args.office_name,
                office_address: args.office_address,
                status: 1,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
    
            return office
        }
    },
    updateOffice: {
        type,
        args: {
            id: { type: GraphQLID },
            office_name: { type: GraphQLString },
            office_address: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            const office = await Office.updateEntry(_, {
                id: args.id,
                fields: {
                    office_name: args.office_name,
                    office_address: args.office_address,
                    modified_date: new Date(),
                    modified_by: args.user_id
                }
            })
            return office
        }
    },
}