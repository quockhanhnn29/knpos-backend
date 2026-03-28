const {
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
} = require('graphql')
const type = require('./type')
const { GraphQLUpload } = require('graphql-upload')
const Pos = require('../pos/pos')
const Bank = require('../bank/bank')
const Office = require('../office/office')
const PosLog = require('../pos_log/pos_log')
const PosContract = require('./pos_contract')
const PosContractLog = require('../pos_contract_log/pos_contract_log')
const { storeUpload, ExcelDateToJSDate } = require('./../../util/util')
const XLSX = require('xlsx');
const lodash = require('lodash')
const moment = require('moment')

// Defines the mutations
module.exports = {
    addPosContract: {
        type,
        args: {
            so_hd: { type: GraphQLString },
            provider_id: { type: GraphQLInt },
            supplier_id: { type: GraphQLInt },
            loai_may_id: { type: GraphQLInt },
            ngay_ky: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            let attachments = '';
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                attachments = file.path;
            }
            const contract = await PosContract.createEntry(_, {
                so_hd: args.so_hd,
                provider_id: args.provider_id,
                supplier_id: args.supplier_id,
                loai_may_id: args.loai_may_id,
                ngay_ky: args.ngay_ky,
                status: 0,
                attachments: attachments,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
            await PosContractLog.createEntry(_, {
                contract_id: contract.id,
                activity_type: 'Khởi tạo',
                description: args.ngay_ky + ': Ký hợp đồng',
                attachments: attachments,
                timestamp: new Date(),
                user_id: args.user_id
            })
    
            return contract
        }
    },

    importListPos: {
        type: GraphQLBoolean,
        args: {
            id: { type: GraphQLInt },
            supplier_id: { type: GraphQLInt },
            model_id: { type: GraphQLInt },
            so_hd: { type: GraphQLString },
            attachments: { type: GraphQLUpload },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            let attachments = '';
            const date_row = [8, 10, 12];
            if (args.attachments) {
                const file = await storeUpload(args.attachments, process.env.POS_DIR)
                let listPosByContract = await Pos.executeQueryString2(`select p.* from pos p where p.contract_id = ? and p.soft_deleted = 0 group by p.seri order by p.seri`, [args.id]);
                let listBanks = await Bank.executeQueryString2(`select b.* from bank b where b.soft_deleted = 0`, []);
                let listOffices = await Office.executeQueryString2(`select o.* from offices o where o.soft_deleted = 0`, []);
                attachments = file.path;
                var wb = XLSX.readFile(attachments, {type: 'binary', cellDates: false});
                let data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, blankrows: false, defval: '', raw: true });
                data.shift();
                let list_update = [], list_add = [], pos_logs = [];
                data.forEach((r) => {
                    date_row.forEach((d) => {
                        if (r[d]) {
                            if (typeof r[d] == 'string') {
                                r[d] = moment(r[d]).format('YYYY-MM-DD');
                            } else if (typeof r[d] == 'number') {
                                r[d] = moment(ExcelDateToJSDate(r[d])).format('YYYY-MM-DD');
                            }
                        } else {
                            r[d] = null
                        }
                    });
                    let bank = lodash.find(listBanks, b => lodash.toLower(b.ten_bank).replaceAll(' ', '') == lodash.toLower(r[6]).replaceAll(' ', ''));
                    let office = lodash.find(listOffices, b => lodash.toLower(b.office_name).replaceAll(' ', '') == lodash.toLower(r[5]).replaceAll(' ', ''));
                    let pos = lodash.find(listPosByContract, p => p.seri == r[4]);
                    if (pos) {
                        list_update.push({
                            id: pos.id,
                            bank_id: bank ? bank.id : 0,
                            kn_office_id: office ? office.id : 0,
                            loai_kho: r[7] == 'Y' ? 0 : 1,
                            ngay_nhap_kho: r[8],
                            thanh_toan: r[9] == 'Y' ? 1 : 0,
                            ngay_thanh_toan: r[10],
                            hoan_tra: r[11] == 'Y' ? 1 : 0,
                            ngay_hoan_tra: r[12],
                            modified_date: new Date(),
                            modified_by: args.user_id
                        })
                        pos_logs.push({
                            pos_id: pos.id,
                            user_id: args.user_id,
                            activity_type: 'Cập nhật thông tin từ danh sách',
                            description: '',
                            attachments: attachments,
                            timestamp: new Date()
                        })
                    } else {
                        list_add.push({
                            seri: r[4],
                            supplier_id: args.supplier_id,
                            loai_may_id: args.model_id,
                            contract_id: args.id,
                            bank_id: bank ? bank.id : 0,
                            kn_office_id: office ? office.id : 0,
                            loai_kho: r[7] == 'Y' ? 0 : 1,
                            ngay_nhap_kho: r[8],
                            thanh_toan: r[9] == 'Y' ? 1 : 0,
                            ngay_thanh_toan: r[10],
                            hoan_tra: r[11] == 'Y' ? 1 : 0,
                            ngay_hoan_tra: r[12],
                            status: 0,
                            soft_deleted: 0,
                            created_date: new Date(),
                            modified_date: new Date(),
                            modified_by: args.user_id
                        })
                    }
                });
                await Pos.updateEntries(_, list_update, []);
                await Pos.createEntries(_, list_add);
                if (list_add.length > 0) {
                    let list_new_seri = [];
                    list_add.map(item => {
                        list_new_seri.push(item.seri)
                    })
                    let list_new_pos = await Pos.executeQueryString2(`select p.* from pos p where p.seri IN (?) and p.soft_deleted = 0 group by p.seri order by p.seri`, [list_new_seri]);
                    list_new_pos.forEach(p => {
                        pos_logs.push({
                            pos_id: p.id,
                            user_id: args.user_id,
                            activity_type: 'Cập nhật máy mới từ danh sách',
                            description: '',
                            attachments: attachments,
                            timestamp: new Date()
                        })
                    })
                }
                await PosLog.createEntries(_, pos_logs);
                let total = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.contract_id = ${ args.id }`);
                let status = 0;
                if (total.length > 0 && total[0].total > 0) {
                    let received = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.loai_kho = 0 and p.contract_id = ${ args.id }`);
                    if (received.length > 0 && received[0].total > 0 && received[0].total == total[0].total) {
                        status = 1;
                        let paid = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.thanh_toan = 1 and p.contract_id = ${ args.id }`);
                        if (paid.length > 0 && paid[0].total > 0 && paid[0].total == total[0].total) {
                            status = 2;
                        }
                    }
                }
                await PosContract.updateEntry(_, {id: args.id, fields: {
                    status: status,
                    modified_date: new Date(),
                    modified_by: args.user_id
                }});
                await PosContractLog.createEntry(_, {
                    contract_id: args.id,
                    activity_type: 'Cập nhật danh sách máy',
                    description: '',
                    attachments: attachments,
                    timestamp: new Date(),
                    user_id: args.user_id
                })
            } else return false;
        }
    }
}