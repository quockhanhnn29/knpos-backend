const {
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const SupplierPos = require('./supplier_pos')
const PosModel = require('../pos_model/pos_model')


// Defines the mutations
module.exports = {
    addSupplierPos: {
        type,
        args: {
            ten: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            user_id: { type: GraphQLInt },
            pos_model: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            let pos_model = args.pos_model ? JSON.parse(Buffer.from(args.pos_model, 'base64').toString('ascii')) : '';
            const pos = await SupplierPos.createEntry(_, {
                ten: args.ten,
                dia_chi: args.dia_chi,
                status: 0,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
            if (pos && pos.id && pos_model && pos_model.length > 0) {
                let model_to_insert = [];
                pos_model.forEach((item) => {
                    model_to_insert.push({
                        supplier_id: pos.id,
                        ten: item.ten,
                        status: 0,
                        soft_deleted: 0,
                        created_date: new Date(),
                        modified_date: new Date(),
                        modified_by: args.user_id
                    })
                })
                await PosModel.createEntries(_, model_to_insert);
            }
            return pos
        }
    },
    updateSupplierPos: {
        type,
        args: {
            id: { type: GraphQLID },
            ten: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            user_id: { type: GraphQLInt },
            pos_model: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            let pos_model = args.pos_model ? JSON.parse(Buffer.from(args.pos_model, 'base64').toString('ascii')) : '';
            if (pos_model && pos_model.length > 0) {
                let model_to_update = [], model_to_insert = [];
                pos_model.forEach((item) => {
                    if (item.id > 0) {
                        model_to_update.push({
                            id: item.id,
                            supplier_id: args.id,
                            ten: item.ten,
                            modified_date: new Date(),
                            modified_by: args.user_id
                        })
                    } else {
                        model_to_insert.push({
                            supplier_id: args.id,
                            ten: item.ten,
                            status: 0,
                            soft_deleted: 0,
                            created_date: new Date(),
                            modified_date: new Date(),
                            modified_by: args.user_id
                        })
                    }
                })
                await PosModel.updateEntries(_, model_to_update, []);
                await PosModel.createEntries(_, model_to_insert);
            }
            const pos = await SupplierPos.updateEntry(_, {
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