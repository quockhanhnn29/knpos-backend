const {
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const type = require('./type')
const { GraphQLUpload } = require('graphql-upload')
const { storeUpload } = require('./../../util/util')
const Pos = require('./pos')
const PosLog = require('../pos_log/pos_log')

// Defines the mutations
module.exports = {
    returnPOS: {
        type: GraphQLBoolean,
        args: {
            pos_id: { type: new GraphQLList(GraphQLInt) },
            user_id_hoan_tra: { type: GraphQLInt },
            ngay_hoan_tra: { type: GraphQLString },
            ly_do_hoan_tra: { type: GraphQLString },
            files_hoan_tra: {
                description: 'Bien ban hoan tra',
                type: GraphQLUpload
            },
        },
        resolve: async (_, args, context) => {
            let url_files = '';
            if (args.files_hoan_tra) {
                var f = await storeUpload(args.files_hoan_tra, process.env.POS_DIR);
                url_files = f.path;
            }
            args.pos_id.forEach(async id => {
                await Pos.updateEntry(_, {id: id, fields: {
                    status: 4,
                    modified_date: new Date(),
                    modified_by: args.user_id_hoan_tra
                }});
                await PosLog.createEntry(_, { 
                    pos_id: id,
                    user_id: args.user_id_hoan_tra,
                    activity_type: args.ngay_hoan_tra + ': Hoàn trả POS',
                    description: `Lý do hoàn trả: ${args.ly_do_hoan_tra}`,
                    attachments: args.files_hoan_tra ? url_files : '',
                    timestamp: new Date()
                });
            });
        }
    },
    updatePOSOffice: {
        type: GraphQLBoolean,
        args: {
            pos_id: { type: new GraphQLList(GraphQLInt) },
            office_id: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args) => {
            try {
                await Pos.executeQueryString2(`update pos set kn_office_id = ?, modified_date = ?, modified_by = ? where id IN (?) and status = 0;`, [args.office_id, new Date(), args.user_id, args.pos_id]);
                args.pos_id.forEach(async id => {
                    await PosLog.createEntry(_, { 
                        pos_id: id,
                        user_id: args.user_id,
                        activity_type: 'Phân kho thiết bị',
                        description: '',
                        attachments: '',
                        timestamp: new Date()
                    });
                });
                return true;
            } catch(e) {
                return false;
            }
        }
    },
    updatePOSStatus: {
        type: GraphQLBoolean,
        args: {
            pos_id: { type: new GraphQLList(GraphQLInt) },
            status: { type: GraphQLInt },
            status_note: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args) => {
            try {
                await Pos.executeQueryString2(`update pos set status = ?, modified_date = ?, modified_by = ? where id IN (?)`, [args.status, new Date(), args.user_id, args.pos_id]);
                args.pos_id.forEach(async id => {
                    await PosLog.createEntry(_, { 
                        pos_id: id,
                        user_id: args.user_id,
                        activity_type: 'Cập nhật trạng thái',
                        description: args.status_note,
                        attachments: '',
                        timestamp: new Date()
                    });
                });
                return true;
            } catch(e) {
                return false;
            }
        }
    }
}