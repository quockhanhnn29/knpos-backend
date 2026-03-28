const {
    GraphQLString,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const type_fee_rate = require('./type_fee_rate')
const BankBranch = require('./bank_branch')
const BankCard = require('./loai_the')
const BankFeeRate = require('./fee_rate')
const BankFeeRateLog = require('./fee_rate_log')
const { GraphQLUpload } = require('graphql-upload')
const { storeUpload } = require('./../../util/util')
const moment = require('moment')

// Defines the mutations
module.exports = {
    addBankBranch: {
        type,
        args: {
            bank_id: { type: GraphQLInt },
            ten_chi_nhanh: { type: GraphQLString },
            ma_chi_nhanh: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            ngay_bat_dau: { type: GraphQLString },
            loai_dvkd: { type: GraphQLInt },
            status: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
            loai_the: { type: GraphQLString },
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
                let file = await storeUpload(args.ho_so_file, process.env.UPLOAD_DIR)
                ho_so_file = file.path;
            }
            let loai_the = args.loai_the ? JSON.parse(Buffer.from(args.loai_the, 'base64').toString('ascii')) : '';
            const bank = await BankBranch.createEntry(_, {
                bank_id: args.bank_id,
                ten_chi_nhanh: args.ten_chi_nhanh,
                ma_chi_nhanh: args.ma_chi_nhanh,
                dia_chi: args.dia_chi,
                ngay_bat_dau: args.ngay_bat_dau ? args.ngay_bat_dau : new Date(),
                loai_dvkd: args.loai_dvkd,
                ho_so_file: ho_so_file ? ho_so_file : null,
                status: args.status,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
            if (bank && bank.id && loai_the && loai_the.length > 0) {
                let model_to_insert = [];
                loai_the.forEach((item) => {
                    model_to_insert.push({
                        chi_nhanh_bank_id: bank.id,
                        ten_the: item.ten_the,
                        ten_doi_soat: item.ten_doi_soat,
                        soft_deleted: 0,
                        created_date: new Date(),
                        modified_date: new Date(),
                        modified_by: args.user_id
                    })
                })
                await BankCard.createEntries(_, model_to_insert);
            }
            return bank
        }
    },

    updateBankBranch: {
        type,
        args: {
            id: { type: GraphQLInt },
            bank_id: { type: GraphQLInt },
            ten_chi_nhanh: { type: GraphQLString },
            ma_chi_nhanh: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            ngay_bat_dau: { type: GraphQLString },
            loai_dvkd: { type: GraphQLInt },
            status: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
            loai_the: { type: GraphQLString },
            soft_deleted: { type: GraphQLInt },
            ho_so_file: {
                description: 'Upload file.',
                type: GraphQLUpload
            }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const BankBranchItem = await BankBranch.findOne(_, [], {id: args.id})
            if (!BankBranchItem || !BankBranchItem.id) {
                throw new Error('Branch not found!')
            }
            let ho_so_file = '';
            if (args.ho_so_file) {
                let file = await storeUpload(args.ho_so_file, process.env.UPLOAD_DIR)
                ho_so_file = file.path;
            }
            let loai_the = args.loai_the ? JSON.parse(Buffer.from(args.loai_the, 'base64').toString('ascii')) : '';
            const bank = await BankBranch.updateEntry(_, {
                id: args.id,
                fields: {
                    ten_chi_nhanh: args.ten_chi_nhanh,
                    ma_chi_nhanh: args.ma_chi_nhanh,
                    dia_chi: args.dia_chi,
                    ngay_bat_dau: args.ngay_bat_dau ? args.ngay_bat_dau : BankBranchItem.ngay_bat_dau,
                    loai_dvkd: args.loai_dvkd,
                    ho_so_file: ho_so_file ? ho_so_file : BankBranchItem.ho_so_file,
                    status: args.status,
                    soft_deleted: args.soft_deleted,
                    modified_date: new Date(),
                    modified_by: args.user_id
                }
            })
            if (bank && bank.id && loai_the && loai_the.length > 0) {
                let model_to_update = [], model_to_insert = [];
                loai_the.forEach((item) => {
                    if (item.id > 0) {
                        model_to_update.push({
                            id: item.id,
                            ten_the: item.ten_the,
                            ten_doi_soat: item.ten_doi_soat,
                            soft_deleted: item.soft_deleted,
                            modified_date: new Date(),
                            modified_by: args.user_id
                        })
                    } else {
                        model_to_insert.push({
                            chi_nhanh_bank_id: args.id,
                            ten_the: item.ten_the,
                            ten_doi_soat: item.ten_doi_soat,
                            soft_deleted: 0,
                            created_date: new Date(),
                            modified_date: new Date(),
                            modified_by: args.user_id
                        })
                    }
                })
                await BankCard.updateEntries(_, model_to_update, []);
                await BankCard.createEntries(_, model_to_insert);
            }
            return bank
        }
    },
    addBankBranchFeeRate: {
        type: type_fee_rate,
        args: {
            chi_nhanh_bank_id: { type: GraphQLInt },
            loai_hinh_kd_id: { type: GraphQLInt },
            loai_the_id: { type: GraphQLInt },
            phi_goc: { type: GraphQLFloat },
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
            const bank = await BankFeeRate.createEntry(_, {
                chi_nhanh_bank_id: args.chi_nhanh_bank_id,
                loai_hinh_kd_id: args.loai_hinh_kd_id,
                loai_the_id: args.loai_the_id,
                phi_goc: args.phi_goc,
                phi_cai_pos: args.phi_cai_pos,
                phi_ban_agent: args.phi_ban_agent,
                ngay_bat_dau: args.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc ? args.ngay_ket_thuc : null,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
            let info = `Gốc - ${args.phi_goc}, Cài - ${args.phi_cai_pos}, Bán - ${args.phi_ban_agent}. Hiệu lực từ ${moment(args.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (args.ngay_ket_thuc) {
                info += ` đến ${moment(args.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            await BankFeeRateLog.createEntry(_, {
                dvkd_fee_rate_id: bank.id,
                chi_nhanh_bank_id: args.chi_nhanh_bank_id,
                thong_tin_cu: null,
                thong_tin_moi: info,
                timestamp: new Date(),
                user_id: args.user_id
            })
            return bank
        }
    },
    updateBankBranchFeeRate: {
        type: type_fee_rate,
        args: {
            id: { type: GraphQLInt },
            chi_nhanh_bank_id: { type: GraphQLInt },
            phi_goc: { type: GraphQLFloat },
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
            const current = await BankFeeRate.findOne(_, [], {id: args.id});
            if (!current || !current.id) {
                throw new Error('Item not found!')
            }
            let old_info = `Gốc - ${current.phi_goc}, Cài - ${current.phi_cai_pos}, Bán - ${current.phi_ban_agent}. Hiệu lực từ ${moment(current.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (current.ngay_ket_thuc) {
                old_info += ` đến ${moment(current.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            let info = `Gốc - ${args.phi_goc}, Cài - ${args.phi_cai_pos}, Bán - ${args.phi_ban_agent}. Hiệu lực từ ${moment(args.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (args.ngay_ket_thuc) {
                info += ` đến ${moment(args.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            await BankFeeRateLog.createEntry(_, {
                dvkd_fee_rate_id: args.id,
                chi_nhanh_bank_id: args.chi_nhanh_bank_id,
                thong_tin_cu: old_info,
                thong_tin_moi: info,
                timestamp: new Date(),
                user_id: args.user_id
            })
            const bank = await BankFeeRate.updateEntry(_, {id: args.id, fields: {
                phi_goc: args.phi_goc,
                phi_cai_pos: args.phi_cai_pos,
                phi_ban_agent: args.phi_ban_agent,
                ngay_bat_dau: args.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc,
                modified_date: new Date(),
                modified_by: args.user_id
            }})
            return bank
        }
    },
}