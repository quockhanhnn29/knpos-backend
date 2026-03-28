const {
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
} = require('graphql')
const { GraphQLUpload } = require('graphql-upload')
const type = require('./type');
const XLSX = require('xlsx');
const lodash = require('lodash');
const moment = require('moment');
const Transaction = require('./transaction')
const TransactionHold = require('./transaction_hold')
const TransactionTransfer = require('./transaction_transfer')
const MerchantBank = require('../merchant_bank/merchant_bank')
const { storeUpload, parseVNDate } = require('./../../util/util')
const { unlink } = require('fs')

// Defines the mutations
module.exports = {
    importHDBankData: {
        type: GraphQLBoolean,
        args: {
            bank_id: { type: GraphQLInt },
            time_from: { type: GraphQLString },
            time_to: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            if (args.time_from && args.time_to && args.attachments) {
                await Transaction.executeQueryString(`delete from kn_transaction where bank_id = 1 AND time_gd >= "${args.time_from}" AND time_gd <= "${args.time_to}"`);
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                const wb = XLSX.readFile(file.path, {type: 'binary', cellDates: false});
                let list_add = [];
                let uid = Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                wb.SheetNames.forEach(s => {
                    let data = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1, blankrows: false, defval: '', raw: true });
                    data = data.slice(4);
                    data.forEach((r) => {
                        let date1 = moment(parseVNDate(r[9].split(' ')[1])).format('YYYY-MM-DD');
                        let date2 = moment(parseVNDate(r[10].split(' ')[1])).format('YYYY-MM-DD');
                        let obj = {
                            bank_id: 1,
                            mid: r[3],
                            tid: r[4],
                            so_the: r[5],
                            so_tien_gd: parseInt(r[6].replaceAll(',', '').replaceAll('.', '')),
                            so_tien_bc: parseInt(r[7].replaceAll(',', '').replaceAll('.', '')),
                            so_tien_phi: parseInt(r[8].replaceAll(',', '').replaceAll('.', '')),
                            time_gd: date1 + ' ' + r[9].split(' ')[0],
                            time_bc: date2 + ' ' + r[10].split(' ')[0],
                            loai_the: r[12],
                            ma_chuan_chi: r[13],
                            so_but_toan: null,
                            so_tc: r[14],
                            batch: r[15],
                            status: 0,
                            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                            user_id: args.user_id,
                            section_id: uid
                        };
                        list_add.push(obj);
                    })
                })
                await Transaction.createEntries(_, list_add);
                unlink(file.path, err => {
                    if (err) throw err;
                });
                return true;
            } else return false;
        }
    },

    importVPBankData: {
        type: GraphQLBoolean,
        args: {
            bank_id: { type: GraphQLInt },
            sheetName: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                const wb = XLSX.readFile(file.path, {type: 'binary', cellDates: false});
                let list_add = [];
                let data = XLSX.utils.sheet_to_json(wb.Sheets[args.sheetName], { header: 1, blankrows: false, defval: '', raw: true });
                data = data.slice(2);
                let tids = [];
                data.forEach((r) => {tids.push(r[6])});
                tids = '"' + lodash.uniq(tids).join('","') + '"';
                let mids = await MerchantBank.executeQueryString(`select tid, mid from merchant_bank where tid in (${tids})`);
                let uid = Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                data.forEach((r) => {
                    let date1 = moment('20' + r[7]).format('YYYY-MM-DD');
                    let date2 = moment(parseVNDate(r[2])).format('YYYY-MM-DD');
                    let mb = lodash.find(mids, mb => mb.tid == r[6]);
                    let obj = {
                        bank_id: 2,
                        mid: mb ? mb.mid : null,
                        tid: r[6],
                        so_the: r[8],
                        so_tien_gd: r[10],
                        so_tien_bc: r[3],
                        so_tien_phi: r[4],
                        time_gd: date1,
                        time_bc: date2,
                        loai_the: r[13],
                        ma_chuan_chi: r[9],
                        so_but_toan: r[1],
                        so_tc: null,
                        batch: null,
                        status: 0,
                        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_id: args.user_id,
                        section_id: uid
                    };
                    list_add.push(obj);
                })
                await Transaction.createEntries(_, list_add);
                unlink(file.path, err => {
                    if (err) throw err;
                });
                return true;
            } else return false;
        }
    },

    importVPBankHoldData: {
        type: GraphQLBoolean,
        args: {
            bank_id: { type: GraphQLInt },
            sheetName: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                const wb = XLSX.readFile(file.path, {type: 'binary', cellDates: false});
                let list_add = [];
                let data = XLSX.utils.sheet_to_json(wb.Sheets[args.sheetName], { header: 1, blankrows: false, defval: '', raw: true });
                data = data.slice(2);
                let tids = [];
                data.forEach((r) => {tids.push(r[6])});
                tids = '"' + lodash.uniq(tids).join('","') + '"';
                let mids = await MerchantBank.executeQueryString(`select tid, mid from merchant_bank where tid in (${tids})`);
                let uid = Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                data.forEach((r) => {
                    let date1 = moment('20' + r[7]).format('YYYY-MM-DD');
                    let date2 = moment(parseVNDate(r[2])).format('YYYY-MM-DD');
                    let mb = lodash.find(mids, mb => mb.tid == r[6]);
                    let obj = {
                        bank_id: 2,
                        mid: mb ? mb.mid : null,
                        tid: r[6],
                        so_the: r[8],
                        so_tien_gd: r[10],
                        so_tien_bc: r[3],
                        so_tien_phi: r[4],
                        time_gd: date1,
                        time_bc: date2,
                        loai_the: r[13],
                        ma_chuan_chi: r[9],
                        so_but_toan: r[1],
                        so_tc: null,
                        batch: null,
                        resolved: 0,
                        description: r[15],
                        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_id: args.user_id,
                        section_id: uid
                    };
                    list_add.push(obj);
                })
                await TransactionHold.createEntries(_, list_add);
                unlink(file.path, err => {
                    if (err) throw err;
                });
                return true;
            } else return false;
        }
    },

    resolveVPBankHoldData: {
        type: GraphQLBoolean,
        args: {
            bank_id: { type: GraphQLInt },
            sheetName: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                const wb = XLSX.readFile(file.path, {type: 'binary', cellDates: false});
                let list_update = [];
                let data = XLSX.utils.sheet_to_json(wb.Sheets[args.sheetName], { header: 1, blankrows: false, defval: '', raw: true });
                data = data.slice(2);
                let tids = [];
                data.forEach((r) => {tids.push(r[6])});
                tids = '"' + lodash.uniq(tids).join('","') + '"';
                let kn_hold = await TransactionHold.executeQueryString(`select * from kn_transaction_hold where bank_id = 2 and resolved = 0 and tid in (${tids})`);
                if (!kn_hold.length) return true;
                let uid = Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                data.forEach((r) => {
                    let row = lodash.find(kn_hold, kn => kn.tid == r[6] && kn.ma_chuan_chi == r[9]);
                    if (row) {
                        let obj = {
                            id: row.id,
                            resolved: 1,
                            updated_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                            updated_user_id: args.user_id,
                            updated_section_id: uid
                        };
                        list_update.push(obj);
                    }
                })
                await TransactionHold.updateEntries(_, list_update, []);
                unlink(file.path, err => {
                    if (err) throw err;
                });
                return true;
            } else return false;
        }
    },

    importVPBankTransferData: {
        type: GraphQLBoolean,
        args: {
            bank_id: { type: GraphQLInt },
            sheetName: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                const wb = XLSX.readFile(file.path, {type: 'binary', cellDates: false});
                let list_add = [];
                let data = XLSX.utils.sheet_to_json(wb.Sheets[args.sheetName], { header: 1, blankrows: false, defval: '', raw: true });
                data = data.slice(1);
                let tids = [];
                data.forEach((r) => {tids.push(r[0])});
                tids = '"' + lodash.uniq(tids).join('","') + '"';
                let mids = await MerchantBank.executeQueryString(`select tid, mid from merchant_bank where tid in (${tids})`);
                let uid = Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                data.forEach((r) => {
                    if (r[0] && !lodash.toLower(r[0]).includes('tổng')) {
                        let mb = lodash.find(mids, mb => mb.tid == r[0]);
                        let obj = {
                            bank_id: 2,
                            mid: mb ? mb.mid : null,
                            tid: r[0],
                            loai_the: r[1],
                            so_luong_gd: r[2],
                            so_tien_gd: r[3],
                            ti_le_phi: r[4],
                            so_tien_thu_mc: r[5],
                            so_tien_thanhtoan: r[6],
                            so_tk_nhan: r[10],
                            ten_tk_nhan: r[7],
                            ngan_hang_nhan: r[8],
                            noi_dung_ck: r[9],
                            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                            user_id: args.user_id,
                            section_id: uid
                        };
                        list_add.push(obj);
                    }
                })
                await TransactionTransfer.createEntries(_, list_add);
                unlink(file.path, err => {
                    if (err) throw err;
                });
                return true;
            } else return false;
        }
    },

    importBIDVData: {
        type: GraphQLBoolean,
        args: {
            bank_id: { type: GraphQLInt },
            sheetName: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                const wb = XLSX.readFile(file.path, {type: 'binary', cellDates: false});
                let list_add = [];
                let data = XLSX.utils.sheet_to_json(wb.Sheets[args.sheetName], { header: 1, blankrows: false, defval: '', raw: true });
                data = data.slice(2);
                let tids = [];
                data.forEach((r) => {tids.push(r[2])});
                tids = '"' + lodash.uniq(tids).join('","') + '"';
                let mids = await MerchantBank.executeQueryString(`select tid, mid from merchant_bank where tid in (${tids})`);
                let uid = Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                data.forEach((r) => {
                    let date = moment(parseVNDate(r[0].split(' ')[0])).format('YYYY-MM-DD');
                    let mb = lodash.find(mids, mb => mb.tid == r[2]);
                    let obj = {
                        bank_id: 3,
                        mid: mb ? mb.mid : null,
                        tid: r[2],
                        so_the: null,
                        so_tien_gd: r[1],
                        so_tien_bc: r[1],
                        so_tien_phi: r[12],
                        time_gd: date + ' ' + r[0].split(' ')[1],
                        time_bc: date + ' ' + r[0].split(' ')[1],
                        loai_the: r[10],
                        ma_chuan_chi: r[6],
                        so_but_toan: r[5],
                        so_tc: null,
                        batch: r[3],
                        status: 0,
                        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_id: args.user_id,
                        section_id: uid
                    };
                    list_add.push(obj);
                })
                await Transaction.createEntries(_, list_add);
                unlink(file.path, err => {
                    if (err) throw err;
                });
                return true;
            } else return false;
        }
    },
}