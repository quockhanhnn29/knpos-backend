const {
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const type = require('./type')
const { GraphQLUpload } = require('graphql-upload')
const { storeUpload } = require('./../../util/util')
const type_fee_rate = require('./type_fee_rate')
const MerchantFeeRate = require('./fee_rate')
const MerchantFeeRateLog = require('./fee_rate_log')
const Merchant = require('./merchant')
const MerchantAttachment = require('../merchant_attachments/merchant_attachments')
const MerchantBank = require('../merchant_bank/merchant_bank')
const MerchantBankType = require('../merchant_bank/type')
const MerchantLog = require('../merchant_log/merchant_log')
const MerchantChecklistProcess = require('../merchant_checklist_process/merchant_checklist_process')
const Pos = require('../pos/pos')
const PosLog = require('../pos_log/pos_log')
const MerchantBankAccount = require('../merchant_bank_account/merchant_bank_account')
const MerchantBankPos = require('../merchant_bank_pos/merchant_bank_pos')
const moment = require('moment')

// Defines the mutations
module.exports = {
    addMerchant: {
        type,
        args: {
            agent_id: { type: GraphQLInt },
            kn_office_id: { type: GraphQLInt },
            chi_nhanh_bank_id: { type: GraphQLInt },
            client_id: { type: GraphQLInt },
            loai_hinh_kd: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
            status: { type: GraphQLInt },
            link_ho_so: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
            const merchant = await Merchant.createEntry(_, {
                agent_id: args.agent_id,
                kn_office_id: args.kn_office_id,
                chi_nhanh_bank_id: args.chi_nhanh_bank_id,
                client_id: args.client_id,
                loai_hinh_kd: args.loai_hinh_kd,
                link_ho_so: args.link_ho_so,
                status: args.status || 0,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id,
            });
            return merchant
        }
    },

    updateMerchant: {
        type,
        args: {
            id: { type: GraphQLInt },
            agent_id: { type: GraphQLInt },
            kn_office_id: { type: GraphQLInt },
            chi_nhanh_bank_id: { type: GraphQLInt },
            client_id: { type: GraphQLInt },
            link_ho_so: { type: GraphQLString },
            status: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            const merchant = await Merchant.findOne(_, [], {id: args.id})
            if (!merchant || !merchant.id) {
                throw new Error('Merchant not found!')
            }
            const newMerchant = await Merchant.updateEntry(_, {id: args.id, fields: {
                agent_id: args.agent_id ? args.agent_id : merchant.agent_id,
                kn_office_id: args.kn_office_id ? args.kn_office_id : merchant.kn_office_id,
                chi_nhanh_bank_id: args.chi_nhanh_bank_id ? args.chi_nhanh_bank_id : merchant.chi_nhanh_bank_id,
                client_id: args.client_id ? args.client_id : merchant.client_id,
                link_ho_so: args.link_ho_so ? args.link_ho_so : merchant.link_ho_so,
                status: args.status,
                modified_date: new Date(),
                modified_by: args.user_id,
            }});
            return newMerchant
        }
    },

    addMerchantBank: {
        type: MerchantBankType,
        args: {
            merchant_id: { type: GraphQLInt },
            pos_id: { type: GraphQLInt },
            bank_id: { type: GraphQLInt },
            ngay_ra_ts: { type: GraphQLString },
            ten_hkd_bank: { type: GraphQLString },
            tid: { type: GraphQLString },
            mid: { type: GraphQLString },
            user_id: { type: GraphQLInt }
        },
        resolve: async (_, args, context) => {
            let m = await MerchantBank.createEntry(_, { 
                merchant_id: args.merchant_id,
                bank_id: args.bank_id,
                pos_id: args.pos_id ? args.pos_id : 0,
                ten_hkd_bank: args.ten_hkd_bank ? args.ten_hkd_bank : '',
                tid: args.tid ? args.tid : '',
                mid: args.mid ? args.mid : '',
                ngay_ra_ts: args.ngay_ra_ts ? args.ngay_ra_ts : null,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id,
                status: 0,
                soft_deleted: 0
            });
            if (args.tid && args.mid) {
                await MerchantBankAccount.createEntry(_, { 
                    merchant_id: args.merchant_id,
                    merchant_bank_id: m.id,
                    modified_date: new Date(),
                    modified_by: args.user_id,
                });
            }
            if (args.pos_id) {
                let merchant = await Merchant.executeQueryString(`select c.ten from merchant m join client c on m.client_id = c.id where m.soft_deleted = 0 and m.id = ${args.merchant_id}`);
                let client_name = merchant && merchant.length ? merchant[0].ten : '';
                await Pos.executeQueryString2(`update pos set status = 1, bank_id = ? where id = ?;`, [args.bank_id, args.pos_id]);
                await PosLog.createEntry(_, { 
                    pos_id: args.pos_id,
                    user_id: args.user_id,
                    activity_type: 'Đăng ký POS',
                    description: client_name ? `Merchant ${client_name} (ID: #${args.merchant_id})` : 'Merchant ID: #' + args.merchant_id,
                    attachments: '',
                    timestamp: new Date()
                });
                await MerchantBankPos.createEntry(_, {
                    merchant_id: args.merchant_id,
                    merchant_bank_id: m.id,
                    pos_id: args.pos_id,
                    status: 0,
                    soft_deleted: 0,
                    created_date: new Date(),
                    modified_date: new Date(),
                    modified_by: args.user_id
                })
            }
            return m;
        }
    },

    updateMerchantBank: {
        type: MerchantBankType,
        args: {
            id: { type: GraphQLInt },
            pos_id: { type: GraphQLInt },
            ten_hkd_bank: { type: GraphQLString },
            tid: { type: GraphQLString },
            mid: { type: GraphQLString },
            status: { type: GraphQLInt },
            ngay_ra_ts: { type: GraphQLString },
            ngay_dong_ts: { type: GraphQLString },
            ngay_ban_giao: { type: GraphQLString },
            user_id_ban_giao: { type: GraphQLInt },
            ngay_thu_hoi: { type: GraphQLString },
            user_id_thu_hoi: { type: GraphQLInt },
            ly_do_thu_hoi: { type: GraphQLInt },
            tinh_trang_pos: { type: GraphQLInt },
            tinh_trang_pos_note: { type: GraphQLString },
            soft_deleted: { type: GraphQLInt },
            user_id: { type: GraphQLInt }
        },
        resolve: async (_, args, context) => {
            const merchantBankItem = await MerchantBank.findOne(_, [], {id: args.id})
            if (!merchantBankItem || !merchantBankItem.id) {
                throw new Error('Item not found!')
            }
            if (merchantBankItem.status == 3) {
                return merchantBankItem;
            }
            let m = await Merchant.executeQueryString(`select c.ten, b.bank_id from merchant m join client c on m.client_id = c.id join bank_branch b on b.id = m.chi_nhanh_bank_id where m.soft_deleted = 0 and m.id = ${merchantBankItem.merchant_id}`);
            let client_name = m && m.length ? m[0].ten : '';
            let bank_id = m && m.length ? m[0].bank_id : 0;
            let description = client_name ? `${client_name} (ID: #${merchantBankItem.merchant_id})` : 'Merchant ID: #' + merchantBankItem.merchant_id;
            if (args.soft_deleted && merchantBankItem.pos_id) {
                await Pos.executeQueryString2(`update pos set status = ? where id = ?;`, [0, merchantBankItem.pos_id]);
                await PosLog.createEntry(_, { 
                    pos_id: merchantBankItem.pos_id,
                    user_id: args.user_id,
                    activity_type: 'Hồ sơ bị từ chối',
                    description: description,
                    attachments: '',
                    timestamp: new Date()
                });
            }
            if (args.pos_id > 0 && (merchantBankItem.pos_id != args.pos_id)) {
                await Pos.executeQueryString2(`update pos set status = ?, bank_id = ? where id = ?;`, [1, bank_id, args.pos_id]);
                await PosLog.createEntry(_, { 
                    pos_id: args.pos_id,
                    user_id: args.user_id,
                    activity_type: 'Đăng ký POS',
                    description: description,
                    attachments: '',
                    timestamp: new Date()
                });
                await MerchantBankPos.createEntry(_, {
                    merchant_id: merchantBankItem.merchant_id,
                    merchant_bank_id: merchantBankItem.id,
                    pos_id: args.pos_id,
                    status: 0,
                    soft_deleted: 0,
                    created_date: new Date(),
                    modified_date: new Date(),
                    modified_by: args.user_id
                })
            }
            if (merchantBankItem.pos_id > 0) {
                let status = -1;
                let activity_type = '';
                const MBPosList = await MerchantBankPos.executeQueryString(`select * from merchant_bank_pos where status IN (0,1) and merchant_bank_id = ${ merchantBankItem.id } and pos_id = ${ merchantBankItem.pos_id }`);
                const MBPos = MBPosList && MBPosList.length ? MBPosList[0] : null;
                if (MBPos && (args.ngay_dong_ts || args.soft_deleted)) {
                    await MerchantBankPos.updateEntry(_, {id: MBPos.id, fields: {
                        status: 2,
                        soft_deleted: args.soft_deleted,
                        modified_date: new Date(),
                        modified_by: args.user_id
                    }})
                }
                if (args.pos_id && merchantBankItem.pos_id != args.pos_id) {
                    if (merchantBankItem.status == 0) {
                        status = 0;
                        activity_type = 'Huỷ đăng ký POS';
                        if (MBPos) {
                            await MerchantBankPos.updateEntry(_, {id: MBPos.id, fields: {
                                status: 2,
                                modified_date: new Date(),
                                modified_by: args.user_id
                            }})
                        }
                    }
                } else {
                    if (merchantBankItem.status == 0) {
                        status = args.status == 1 ? 2 : (args.status == 3 ? 0 : -1);
                        activity_type = args.status == 1 ? 'Cấp POS' : 'Huỷ đăng ký POS';
                    }
                    if (merchantBankItem.status == 1 && args.status == 2) {
                        status = args.tinh_trang_pos == 1 ? 3 : 4;
                        activity_type = 'Thu hồi POS';
                        let ly_do = args.ly_do_thu_hoi == 1 ? '. Lý do: Đổi máy' : (args.ly_do_thu_hoi == 3 ? '. Lý do: Yêu cầu đóng từ ngân hàng' : '. Lý do: Không có nhu cầu sử dụng');
                        let tinh_trang = args.tinh_trang_pos == 1 ? '. Tình trạng: Hỏng/thiếu' : '. Tình trạng: bình thường';
                        let note = args.tinh_trang_pos_note ? '. Ghi chú: ' + args.tinh_trang_pos_note : '';
                        description += ly_do + tinh_trang + note;
                    }
                    if (merchantBankItem.status == 2 && merchantBankItem.status != args.status) {
                        let pos = Pos.findOne(_, [], {id: merchantBankItem.pos_id});
                        if (pos && pos.status != 3) {
                            status = 0;
                            activity_type = 'Hoàn tất thu hồi POS';
                        }
                    }
                    if (MBPos) {
                        if (args.user_id_ban_giao && args.ngay_ban_giao) {
                            await MerchantBankPos.updateEntry(_, {id: MBPos.id, fields: {
                                status: 1,
                                ngay_ban_giao: args.ngay_ban_giao,
                                user_id_ban_giao: args.user_id_ban_giao,
                                modified_date: new Date(),
                                modified_by: args.user_id
                            }})
                        }
                        if (args.user_id_thu_hoi && args.ngay_thu_hoi) {
                            await MerchantBankPos.updateEntry(_, {id: MBPos.id, fields: {
                                status: 2,
                                ngay_thu_hoi: args.ngay_thu_hoi,
                                user_id_thu_hoi: args.user_id_thu_hoi,
                                ly_do_thu_hoi: args.ly_do_thu_hoi,
                                tinh_trang_pos: args.tinh_trang_pos ? args.tinh_trang_pos : 0,
                                tinh_trang_pos_note: args.tinh_trang_pos_note,
                                modified_date: new Date(),
                                modified_by: args.user_id
                            }})
                        }
                    }
                }
                if (status >= 0 && activity_type) {
                    await Pos.executeQueryString2(`update pos set status = ?, bank_id = ? where id = ?;`, [status, bank_id, merchantBankItem.pos_id]);
                    await PosLog.createEntry(_, { 
                        pos_id: merchantBankItem.pos_id,
                        user_id: args.user_id,
                        activity_type: activity_type,
                        description: description,
                        attachments: '',
                        timestamp: new Date()
                    });
                }
            }
            let merchant = await MerchantBank.updateEntry(_, {id: args.id, fields: {
                pos_id: args.pos_id ? args.pos_id : merchantBankItem.pos_id,
                ten_hkd_bank: args.ten_hkd_bank ? args.ten_hkd_bank : merchantBankItem.ten_hkd_bank,
                tid: args.tid ? args.tid : merchantBankItem.tid,
                mid: args.mid ? args.mid : merchantBankItem.mid,
                status: args.status,
                ngay_ra_ts: !merchantBankItem.ngay_ra_ts && args.ngay_ra_ts ? args.ngay_ra_ts : merchantBankItem.ngay_ra_ts,
                ngay_dong_ts: !merchantBankItem.ngay_dong_ts && args.ngay_dong_ts ? args.ngay_dong_ts : merchantBankItem.ngay_dong_ts,
                modified_date: new Date(),
                modified_by: args.user_id,
                soft_deleted: args.soft_deleted ? args.soft_deleted : 0
            }});
            if (args.tid && args.mid) {
                let mb_account = await MerchantBankAccount.findOne(_, [], {merchant_bank_id: merchantBankItem.id})
                if (!mb_account) {
                    await MerchantBankAccount.createEntry(_, { 
                        merchant_id: merchantBankItem.merchant_id,
                        merchant_bank_id: merchantBankItem.id,
                        modified_date: new Date(),
                        modified_by: args.user_id,
                    });
                }
            }
            return merchant;
        }
    },

    addCustomMerchantLog: {
        type: GraphQLBoolean,
        args: {
            merchant_id: { type: GraphQLInt },
            activity_type: { type: GraphQLString },
            description: { type: GraphQLString },
            user_id: { type: GraphQLInt },
            note_attachments: { type: GraphQLUpload }
        },
        resolve: async (_, args, context) => {
            let note_attachments = '';
            if (args.note_attachments) {
                let f = await storeUpload(args.note_attachments, process.env.MERCHANT_NOTE_DIR);
                note_attachments = f.path;
            }
            await MerchantLog.createEntry(_, { 
                merchant_id: args.merchant_id,
                user_id: args.user_id,
                activity_type: args.activity_type,
                description: args.description,
                attachments: note_attachments,
                timestamp: new Date()
            });

            return true;
        }
    },

    updateChecklistProcess: {
        type: GraphQLBoolean,
        args: {
            merchant_id: { type: GraphQLInt },
            checklist_id: { type: GraphQLInt },
            status: { type: GraphQLInt },
            description: { type: GraphQLString },
            attachment_file: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            try {
                let attachment = '';
                if (args.attachment_file) {
                    let f = await storeUpload(args.attachment_file, process.env.MERCHANT_DIR);
                    attachment = f.path;
                }
                const checklist_process_item = await MerchantChecklistProcess.findOne(_, [], {checklist_id: args.checklist_id, merchant_id: args.merchant_id});
                if (checklist_process_item && checklist_process_item.id) {
                    if (checklist_process_item.status != args.status) {
                        await MerchantChecklistProcess.updateEntry(_, {id: checklist_process_item.id, fields: {
                            status: args.status,
                            description: args.description ? args.description : checklist_process_item.description,
                            modified_date: new Date(),
                            modified_by: args.user_id
                        }});
                    } else if (args.description && args.description != checklist_process_item.description) {
                        await MerchantChecklistProcess.updateEntry(_, {id: checklist_process_item.id, fields: {
                            description: args.description,
                        }});
                    }
                    if (attachment) {
                        let current_attachment = await MerchantAttachment.findOne(_, [], {checklist_process_id: checklist_process_item.id, status: 0});
                        if (current_attachment) {
                            await MerchantAttachment.updateEntry(_, {id: current_attachment.id, fields: {status: 1}});
                        }
                        MerchantAttachment.createEntry(_, {
                            checklist_process_id: checklist_process_item.id,
                            attachments: attachment,
                            status: 0,
                            created_date: new Date(),
                            uploaded_by: args.user_id
                        })
                    }
                } else {
                    let new_process_item = await MerchantChecklistProcess.createEntry(_, { 
                        merchant_id: args.merchant_id,
                        checklist_id: args.checklist_id,
                        status: args.status,
                        description: args.description,
                        modified_date: new Date(),
                        modified_by: args.user_id
                    });
                    if (attachment) {
                        await MerchantAttachment.createEntry(_, {
                            checklist_process_id: new_process_item.id,
                            attachments: attachment,
                            status: 0,
                            created_date: new Date(),
                            uploaded_by: args.user_id
                        })
                    }
                }
            } catch(e) {
                return false;
            }

            return true;
        }
    },
    addMerchantFeeRate: {
        type: type_fee_rate,
        args: {
            merchant_id: { type: GraphQLInt },
            loai_the_id: { type: GraphQLInt },
            phi_cai_pos: { type: GraphQLFloat },
            phi_ban_agent: { type: GraphQLFloat },
            ngay_bat_dau: { type: GraphQLString },
            ngay_ket_thuc: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const merchant = await MerchantFeeRate.createEntry(_, {
                merchant_id: args.merchant_id,
                loai_the_id: args.loai_the_id,
                phi_cai_pos: args.phi_cai_pos,
                phi_ban_agent: args.phi_ban_agent,
                ngay_bat_dau: args.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc ? args.ngay_ket_thuc : null,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
            let info = `Cài - ${args.phi_cai_pos}, Bán - ${args.phi_ban_agent}. Hiệu lực từ ${moment(args.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (args.ngay_ket_thuc) {
                info += ` đến ${moment(args.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            await MerchantFeeRateLog.createEntry(_, {
                merchant_fee_rate_id: merchant.id,
                merchant_id: args.merchant_id,
                thong_tin_cu: null,
                thong_tin_moi: info,
                timestamp: new Date(),
                user_id: args.user_id
            })
            return merchant
        }
    },
    updateMerchantFeeRate: {
        type: type_fee_rate,
        args: {
            id: { type: GraphQLInt },
            merchant_id: { type: GraphQLInt },
            phi_cai_pos: { type: GraphQLFloat },
            phi_ban_agent: { type: GraphQLFloat },
            ngay_bat_dau: { type: GraphQLString },
            ngay_ket_thuc: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const current = await MerchantFeeRate.findOne(_, [], {id: args.id});
            if (!current || !current.id) {
                throw new Error('Item not found!')
            }
            let old_info = `Cài - ${current.phi_cai_pos}, Bán - ${current.phi_ban_agent}. Hiệu lực từ ${moment(current.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (current.ngay_ket_thuc) {
                old_info += ` đến ${moment(current.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            let info = `Cài - ${args.phi_cai_pos}, Bán - ${args.phi_ban_agent}. Hiệu lực từ ${moment(args.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (args.ngay_ket_thuc) {
                info += ` đến ${moment(args.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            await MerchantFeeRateLog.createEntry(_, {
                merchant_fee_rate_id: args.id,
                merchant_id: args.merchant_id,
                thong_tin_cu: old_info,
                thong_tin_moi: info,
                timestamp: new Date(),
                user_id: args.user_id
            })
            const merchant = await MerchantFeeRate.updateEntry(_, {id: args.id, fields: {
                phi_cai_pos: args.phi_cai_pos,
                phi_ban_agent: args.phi_ban_agent,
                ngay_bat_dau: args.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc,
                modified_date: new Date(),
                modified_by: args.user_id
            }})
            return merchant
        }
    },
}