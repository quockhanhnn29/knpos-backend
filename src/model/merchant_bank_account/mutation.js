const {
    GraphQLString,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const MerchantBankAccount = require('./merchant_bank_account')
const MerchantBankAccountLog = require('../merchant_bank_account_log/merchant_bank_account_log')
const moment = require('moment');

// Defines the mutations
module.exports = {
    updateMerchantBankAccount: {
        type,
        args: {
            merchant_bank_id: { type: GraphQLInt },
            chu_tk: { type: GraphQLString },
            stk: { type: GraphQLString },
            ngan_hang: { type: GraphQLString },
            chi_nhanh: { type: GraphQLString },
            email_bc: { type: GraphQLString },
            thoi_gian_hl: { type: GraphQLString },
            ca_hl: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            const mb_account = await MerchantBankAccount.findOne(_, [], {merchant_bank_id: args.merchant_bank_id})
            if (!mb_account || !mb_account.id) {
                throw new Error('Merchant Bank Account not found!')
            }
            if (args.stk != mb_account.stk) {
                const newMBAccount = await MerchantBankAccount.updateEntry(_, {id: mb_account.id, fields: {
                    chu_tk: args.chu_tk ? args.chu_tk : mb_account.chu_tk,
                    stk: args.stk ? args.stk : mb_account.stk,
                    ngan_hang: args.ngan_hang ? args.ngan_hang : mb_account.ngan_hang,
                    chi_nhanh: args.chi_nhanh ? args.chi_nhanh : mb_account.chi_nhanh,
                    email_bc: args.email_bc ? args.email_bc : mb_account.email_bc,
                    thoi_gian_hl: args.thoi_gian_hl ? args.thoi_gian_hl : mb_account.thoi_gian_hl,
                    ca_hl: args.ca_hl ? args.ca_hl : mb_account.ca_hl,
                    modified_date: new Date(),
                    modified_by: args.user_id
                }});
                let thong_tin_cu = '';
                if (mb_account.chu_tk) {
                    thong_tin_cu += mb_account.chu_tk;
                    if (mb_account.email_bc) {
                        thong_tin_cu += ' - ' + mb_account.email_bc;
                    }
                    if (mb_account.stk) {
                        thong_tin_cu += ' - STK: ' + mb_account.stk;
                    }
                    if (mb_account.ngan_hang) {
                        thong_tin_cu += ' - ' + mb_account.ngan_hang;
                    }
                    if (mb_account.chi_nhanh) {
                        thong_tin_cu += ' - Chi nhánh ' + mb_account.chi_nhanh;
                    }
                    if (mb_account.thoi_gian_hl) {
                        thong_tin_cu += ' - ' + moment(mb_account.thoi_gian_hl).format('DD/MM/YYYY');
                    }
                    if (mb_account.ca_hl) {
                        thong_tin_cu += ' - Ca ' + mb_account.ca_hl;
                    }
                }
                let thong_tin_moi = '';
                if (args.chu_tk) {
                    thong_tin_moi += args.chu_tk;
                    if (args.email_bc) {
                        thong_tin_moi += ' - ' + args.email_bc;
                    }
                    if (args.stk) {
                        thong_tin_moi += ' - STK: ' + args.stk;
                    }
                    if (args.ngan_hang) {
                        thong_tin_moi += ' - ' + args.ngan_hang;
                    }
                    if (args.chi_nhanh) {
                        thong_tin_moi += ' - Chi nhánh ' + args.chi_nhanh;
                    }
                    if (args.thoi_gian_hl) {
                        thong_tin_moi += ' - ' + moment(args.thoi_gian_hl).format('DD/MM/YYYY');
                    }
                    if (args.ca_hl) {
                        thong_tin_moi += ' - Ca ' + args.ca_hl;
                    }
                }
                if (thong_tin_moi != thong_tin_cu) {
                    await MerchantBankAccountLog.createEntry(_, { 
                        merchant_id: mb_account.merchant_id,
                        merchant_bank_id: mb_account.merchant_bank_id,
                        thong_tin_cu: thong_tin_cu,
                        thong_tin_moi: thong_tin_moi,
                        timestamp: new Date(),
                        user_id: args.user_id,
                    });
                }
                return newMBAccount
            } else {
                return mb_account;
            }
        }
    },
}