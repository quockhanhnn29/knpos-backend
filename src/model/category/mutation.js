const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const type = require('./type')
const Category = require('./category')
const {UserRoleEnumType} = require('../user_role/enums')


// Defines the mutations
module.exports = {
    addCategory: {
        type,
        args: {
            category_name: { type: GraphQLString },
            description: { type: GraphQLString },
            parent_id: { type: GraphQLID },
            organization_id: { type: GraphQLID }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            
            const category = await Category.createEntry(_, {
                category_name: args.category_name,
                description: args.description,
                parent_id: args.parent_id,
                organization_id: context.isAdmin ? context.user.organization_id : args.organization_id
            })
    
            return category
        }
    },
    updateCategory: {
        type,
        args: {
            id: { type: GraphQLID },
            category_name: { type: GraphQLString },
            description: { type: GraphQLString },
            parent_id: { type: GraphQLID },
            organization_id: { type: GraphQLID }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            
            if (!context.isSuperAdmin) {
                const checkExists = await Category.getByID(_, {id: args.id})
                if (!checkExists || checkExists.organization_id != context.user.organization_id){
                    throw new Error('You are not authorized!')
                }
            }

            const category = await Category.updateEntry(_, {
                id: args.id,
                fields: {
                    category_name: args.category_name,
                    description: args.description,
                    parent_id: args.parent_id,
                    organization_id: context.isAdmin ? context.user.organization_id : args.organization_id
                }
            })
    
            return category
        }
    },
    removeCategory: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLList(GraphQLInt) }
        },
        resolve: async (_, { id }, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            try {
                let fields = { id }
                if (context.isAdmin) {
                    fields.organization_id = context.user.organization_id
                }
                
                await Category.removeByField(_, { fields })
                return true
            } catch (error) {
                return false
            }
        }
    },
}