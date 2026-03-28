let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const AgentType = require('../agent/type')
const Agent = require('../agent/agent')
const MerchantBankType = require('../merchant_bank/type')
const MerchantBank = require('../merchant_bank/merchant_bank')
const BankType = require('../bank/type')
const Bank = require('../bank/bank')
const BankBranchType = require('../bank_branch/type')
const BankBranch = require('../bank_branch/bank_branch')
const OfficeType = require('../office/type')
const Office = require('../office/office')
const ClientType = require('../client/type')
const Client = require('../client/client')
const MerchantChecklist = require('../merchant_checklist/merchant_checklist');
const MerchantBus = require('../merchant_type/merchant_type');
const MerchantChecklistProcess = require('../merchant_checklist_process/merchant_checklist_process');
const MerchantChecklistProcessType = require('../merchant_checklist_process/type');
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Merchant',
    description: 'A Merchant',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        kn_office_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        agent_id: {
            type: GraphQLInt
        },
        client_id: {
            type: GraphQLInt
        },
        chi_nhanh_bank_id: {
            type: GraphQLInt
        },
        loai_hinh_kd: {
            type: GraphQLInt
        },
        ten_loai_hinh_kd: {
            type: GraphQLString,
            resolve: async(obj) => {
                let t = await MerchantBus.executeQueryString(`select a.* from merchant_bus_type a where a.id = ${ obj.loai_hinh_kd }`)
                return t && t.length ? t[0].ten : '';
            }
        },
        link_ho_so: {
            type: GraphQLString
        },
        lastest_checklist_label: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await MerchantChecklist.executeQueryString(`SELECT c.id, c.text from merchant_checklist c JOIN merchant_checklist_process p on p.checklist_id = c.id WHERE p.status = 1 and p.merchant_id = ${obj.id} ORDER BY merchant_status DESC, sort_order DESC`);
                return c && c.length ? c[0].text : '';
            }
        },
        checklist_process: {
            type: new GraphQLList(MerchantChecklistProcessType),
            resolve: async(obj) => {
                return await MerchantChecklistProcess.executeQueryString(`select c.* from merchant_checklist_process c join merchant_checklist mc on mc.id = c.checklist_id where mc.status = 0 and c.status = 1 and mc.merchant_status = ${ obj.status } and c.merchant_id = ${ obj.id }`)
            }
        },
        status: {
            type: GraphQLInt
            // 0 - 'Khởi tạo hồ sơ'; 1 - 'Đang xử lý tại KN'; 2 - 'Xử lý tại ngân hàng'; 3 - 'Đã duyệt'; 4 - 'Đã cấp POS'; 5 - 'Đóng & thu hồi POS'; 6 - 'Từ chối hồ sơ'; 7 - 'Hoàn tất đóng hồ sơ';
        },
        soft_deleted: {
            type: GraphQLBoolean
        },
        created_date: {
            type: GraphQLString
        },
        modified_date: {
            type: GraphQLString
        },
        modified_by: {
            type: GraphQLInt
        },
        client: {
            type: new GraphQLList(ClientType),
            resolve: async(obj) => {
                return await Client.executeQueryString(`select c.* from client c where c.id = ${ obj.client_id }`)
            }
        },
        agent: {
            type: new GraphQLList(AgentType),
            resolve: async(obj) => {
                return await Agent.executeQueryString(`select a.* from agent a where a.id = ${ obj.agent_id }`)
            }
        },
        merchant_bank: {
            type: new GraphQLList(MerchantBankType),
            resolve: async(obj) => {
                return await MerchantBank.executeQueryString(`select mb.* from merchant_bank mb where mb.soft_deleted = 0 and mb.merchant_id = ${ obj.id }`)
            }
        },
        bank_branch: {
            type: new GraphQLList(BankBranchType),
            resolve: async(obj) => {
                return await BankBranch.executeQueryString(`select b.* from bank_branch b where b.id = ${ obj.chi_nhanh_bank_id }`)
            }
        },
        bank: {
            type: new GraphQLList(BankType),
            resolve: async(obj) => {
                return await Bank.executeQueryString(`select bank.* from bank_branch b join bank on bank.id = b.bank_id where b.id = ${ obj.chi_nhanh_bank_id }`)
            }
        },
        office: {
            type: new GraphQLList(OfficeType),
            resolve: async(obj) => {
                return await Office.executeQueryString(`select o.* from offices o where o.id = ${ obj.kn_office_id }`)
            }
        }
    }
})