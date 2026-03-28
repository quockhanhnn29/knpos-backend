const {
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const Bank = require('./bank')
const { GraphQLUpload } = require('graphql-upload')
const { storeUpload } = require('./../../util/util')

// Defines the mutations
module.exports = {
    addBank: {
        type,
        args: {
            ten_bank: { type: GraphQLString },
            ngay_ky_ket: { type: GraphQLString },
            user_id: { type: GraphQLInt },
            ho_so_file: {
                description: 'Upload file.',
                type: GraphQLUpload
            }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            let ho_so_file = null;
            if (args.ho_so_file) {
                let file = await storeUpload(args.ho_so_file, process.env.UPLOAD_DIR)
                ho_so_file = file.path;
            }
            
            const office = await Bank.createEntry(_, {
                ten_bank: args.ten_bank,
                ngay_ky_ket: args.ngay_ky_ket,
                ho_so_file: ho_so_file,
                status: 0,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
    
            return office
        }
    },
    updateBank: {
        type,
        args: {
            id: { type: GraphQLID },
            ten_bank: { type: GraphQLString },
            ngay_ky_ket: { type: GraphQLString },
            user_id: { type: GraphQLInt },
            ho_so_file: {
                description: 'Upload file.',
                type: GraphQLUpload
            }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            let ho_so_file = '';
            if (args.ho_so_file) {
                let file = await storeUpload(args.ho_so_file, process.env.IMAGE_DIR)
                ho_so_file = file.path;
            }

            let fields = {
                ten_bank: args.ten_bank,
                ngay_ky_ket: args.ngay_ky_ket,
                modified_date: new Date(),
                modified_by: args.user_id
            }

            if (ho_so_file) {
                fields.ho_so_file = ho_so_file;
            }

            const office = await Bank.updateEntry(_, {
                id: args.id,
                fields: fields
            })
            return office
        }
    },
}