const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const type = require('./type')
const Tag = require('./tag')
const {UserRoleEnumType} = require('../user_role/enums')


// Defines the mutations
module.exports = {
    addTag: {
        type,
        args: {
            tag_name: { type: GraphQLString },
            description: { type: GraphQLString },
            parent_id: { type: GraphQLID },
            organization_id: { type: GraphQLID }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            
            const tag = await Tag.createEntry(_, {
                tag_name: args.tag_name,
                description: args.description,
                parent_id: args.parent_id,
                organization_id: context.isAdmin ? context.user.organization_id : args.organization_id
            })
    
            return tag
        }
    },
    updateTag: {
        type,
        args: {
            id: { type: GraphQLID },
            tag_name: { type: GraphQLString },
            description: { type: GraphQLString },
            parent_id: { type: GraphQLID },
            organization_id: { type: GraphQLID }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            if (!context.isSuperAdmin) {
                const checkExists = await Tag.getByID(_, {id: args.id})
                if (!checkExists || checkExists.organization_id != context.user.organization_id){
                    throw new Error('You are not authorized!')
                }
            }

            const tag = await Tag.updateEntry(_, {
                id: args.id,
                fields: {
                    tag_name: args.tag_name,
                    description: args.description,
                    parent_id: args.parent_id,
                    organization_id: context.isAdmin ? context.user.organization_id : args.organization_id
                }
            })
    
            return tag
        }
    },
    removeTag: {
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
                await Tag.removeByField(_, { fields })
                return true
            } catch (error) {
                return false
            }
        }
    },
}