const {
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const ProviderPos = require('./pos_provider')


// Defines the mutations
module.exports = {
    addProviderPos: {
        type,
        args: {
            ten: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            
            const pos = await ProviderPos.createEntry(_, {
                ten: args.ten,
                dia_chi: args.dia_chi,
                status: 0,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
    
            return pos
        }
    },
    updateProviderPos: {
        type,
        args: {
            id: { type: GraphQLID },
            ten: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            const pos = await ProviderPos.updateEntry(_, {
                id: args.id,
                fields: {
                    ten: args.ten,
                    dia_chi: args.dia_chi,
                    modified_date: new Date(),
                    modified_by: args.user_id
                }
            })
            return pos
        }
    },
}