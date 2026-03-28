let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const Bank = require('../bank/bank')
const Supplier = require('../supplier_pos/supplier_pos')
const Office = require('../office/office')
const MerchantBankType = require('../merchant_bank/type')
const MerchantBank = require('../merchant_bank/merchant_bank')
const MerchantBankPosType = require('../merchant_bank_pos/type')
const MerchantBankPos = require('../merchant_bank_pos/merchant_bank_pos')
const Agent = require('../agent/agent')
const PosLogType = require('../pos_log/type')
const PosLog = require('../pos_log/pos_log')
const PosModel = require('../pos_model/pos_model')
const PosContract = require('../pos_contract/pos_contract')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'pos',
    description: 'A pos',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        bank_id: {
            type: GraphQLInt
        },
        supplier_id: {
            type: GraphQLInt
        },
        contract_id: {
            type: GraphQLInt
        },
        loai_may_id: {
            type: GraphQLInt
        },
        kn_office_id: {
            type: GraphQLInt
        },
        seri: {
            type: GraphQLString
        },
        ngay_nhap_kho: {
            type: GraphQLString
        },
        loai_kho: {
            type: GraphQLInt
            // 0-thực nhận; 1-Ký gửi
        },
        ngay_thanh_toan: {
            type: GraphQLString
        },
        thanh_toan: {
            type: GraphQLInt
            // 0-chưa TT; 1-đã TT
        },
        ngay_hoan_tra: {
            type: GraphQLString
        },
        hoan_tra: {
            type: GraphQLInt
            // 0-chưa hoàn trả; 1-đã hoàn trả
        },
        status: {
            type: GraphQLInt
            // 0 - sẵn; 1 - đã đăng ký; 2 - đã cấp; 3 - hỏng; 4 - đang thu hồi; 5 - thanh lý
        },
        modified_by: {
            type: GraphQLInt
        },
        merchant_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await MerchantBank.executeQueryString(`select c.* from merchant_bank mb join merchant m on mb.merchant_id = m.id join client c on m.client_id = c.id where m.status IN (2,3,4,5) and mb.pos_id = ${ obj.id } and mb.soft_deleted = 0 and mb.status IN (0,1,2)`);
                return c && c.length ? c[0].ten : '';
            }
        },
        merchant_bank: {
            type: MerchantBankType,
            resolve: async(obj) => {
                let c = await MerchantBank.executeQueryString(`select mb.* from merchant_bank mb join merchant m on mb.merchant_id = m.id where m.status IN (2,3,4,5) and mb.pos_id = ${ obj.id } and mb.soft_deleted = 0 and mb.status IN (0,1,2)`);
                return c && c.length ? c[0] : null;
            }
        },
        merchant_bank_pos: {
            type: MerchantBankPosType,
            resolve: async(obj) => {
                let c = await MerchantBankPos.executeQueryString(`select m.* from merchant_bank_pos m join merchant_bank mb on m.merchant_bank_id = mb.id and m.pos_id = ${ obj.id } where mb.pos_id = ${ obj.id } and mb.status IN (0,1,2)`);
                return c && c.length ? c[0] : null;
            }
        },
        ngay_ban_giao: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await MerchantBankPos.executeQueryString(`select m.* from merchant_bank_pos m join merchant_bank mb on m.merchant_bank_id = mb.id and m.pos_id = ${ obj.id } where mb.pos_id = ${ obj.id } and mb.status IN (0,1,2)`);
                return c && c.length ? c[0].ngay_ban_giao : '';
            }
        },
        so_hd: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await PosContract.executeQueryString(`select c.* from pos_contract c where c.id = ${ obj.contract_id }`)
                return c && c.length ? c[0].so_hd : '';
            }
        },
        provider: {
            type: GraphQLString,
            resolve: async(obj) => {
                let p = await PosContract.executeQueryString(`select p.* from pos_contract c join pos_provider p on p.id = c.provider_id where c.id = ${ obj.contract_id }`)
                return p && p.length ? p[0].ten : '';
            }
        },
        loai_may: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await PosModel.executeQueryString(`select p.* from supplier_pos_model p where p.id = ${ obj.loai_may_id }`)
                return c && c.length ? c[0].ten : '';
            }
        },
        supplier: {
            type: GraphQLString,
            resolve: async(obj) => {
                let s = await Supplier.executeQueryString(`select s.* from supplier_pos s where s.id = ${ obj.supplier_id }`)
                return s && s.length ? s[0].ten : '';
            }
        },
        bank_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let s = await Bank.executeQueryString(`select b.* from bank b where b.id = ${ obj.bank_id }`)
                return s && s.length ? s[0].ten_bank : '';
            }
        },
        office: {
            type: GraphQLString,
            resolve: async(obj) => {
                let s = await Office.executeQueryString(`select o.* from offices o where o.id = ${ obj.kn_office_id }`)
                return s && s.length ? s[0].office_name : '';
            }
        },
        agent: {
            type: GraphQLString,
            resolve: async(obj) => {
                let s = await Agent.executeQueryString(`select a.* from merchant_bank mb join merchant m on m.id = mb.merchant_id join agent a on a.id = m.agent_id where m.status IN (2,3,4,5) and mb.soft_deleted = 0 and mb.status IN (0,1,2) and mb.pos_id = ${ obj.id }`)
                return s && s.length ? s[0].ten_dai_ly : '';
            }
        },
        pos_log: {
            type: new GraphQLList(PosLogType),
            resolve: async(obj) => {
                return await PosLog.executeQueryString(`select p.* from pos_log p where p.pos_id = ${ obj.id } order by p.timestamp desc`)
            }
        }
    }
})