const {
    GraphQLString,
    GraphQLID,
} = require('graphql')
const type = require('./type')
const MerchantBusType = require('./merchant_type')


// Defines the mutations
module.exports = {
    addMerchantBusType: {
        type,
        args: {
            ten: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            
            const mcc = await MerchantBusType.createEntry(_, {
                ten: args.ten,
                status: 0
            })
    
            return mcc
        }
    },
    updateMerchantBusType: {
        type,
        args: {
            id: { type: GraphQLID },
            ten: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            const mcc = await MerchantBusType.updateEntry(_, {
                id: args.id,
                fields: {
                    ten: args.ten,
                }
            })
            return mcc
        }
    },
}