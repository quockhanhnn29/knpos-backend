const { GraphQLObjectType } = require('graphql')
const userQuery = require('../model/user/queries')
const catQuery = require('../model/category/query')
const clientQuery = require('../model/client/query')
const tagQuery = require('../model/tag/query')
const officeQuery = require('../model/office/query')
const posQuery = require('../model/pos/query')
const supplierPosQuery = require('../model/supplier_pos/query')
const posModelQuery = require('../model/pos_model/query')
const posProviderQuery = require('../model/pos_provider/query')
const posContractQuery = require('../model/pos_contract/query')
const agentQuery = require('../model/agent/query')
const MerchantBankQuery = require('../model/merchant_bank/query')
const MerchantBankAccountQuery = require('../model/merchant_bank_account/query')
const MerchantBankAccountLogQuery = require('../model/merchant_bank_account_log/query')
const MerchantQuery = require('../model/merchant/query')
const MerchantLogQuery = require('../model/merchant_log/query')
const MerchantChecklistQuery = require('../model/merchant_checklist/query')
const MerchantTypeQuery = require('../model/merchant_type/query')
const BankQuery = require('../model/bank/query')
const BankBranchQuery = require('../model/bank_branch/query')
const transactionQuery = require('../model/transaction/query')

module.exports = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: userQuery.users,
        user: userQuery.user,
        web_configs: userQuery.web_configs,
        categories: catQuery.categories,
        category: catQuery.category,
        tags: tagQuery.tags,
        tag: tagQuery.tag,

        offices: officeQuery.offices,
        office: officeQuery.office,
        poses: posQuery.poses,
        pos: posQuery.pos,
        pos_report: posQuery.pos_report,
        pos_by_supplier: posQuery.pos_by_supplier,
        pos_model: posModelQuery.pos_model,
        suppliers: supplierPosQuery.suppliers,
        providers: posProviderQuery.providers,
        pos_contracts: posContractQuery.pos_contracts,
        pos_contract: posContractQuery.pos_contract,

        agents: agentQuery.agents,
        agent: agentQuery.agent,
        clients: clientQuery.clients,
        merchants: MerchantQuery.merchants,
        merchant: MerchantQuery.merchant,
        merchant_existed: MerchantQuery.merchant_existed,
        merchant_report: MerchantQuery.merchant_report,
        merchant_banks: MerchantBankQuery.merchant_banks,
        merchant_bank: MerchantBankQuery.merchant_bank,
        banks: BankQuery.banks,
        bank: BankQuery.bank,
        bank_branches: BankBranchQuery.bank_branches,
        bank_branch: BankBranchQuery.bank_branch,
        merchant_checklist: MerchantChecklistQuery.merchant_checklist,
        merchant_type: MerchantTypeQuery.merchant_type,
        merchant_logs: MerchantLogQuery.merchant_logs,
        merchant_bank_accounts: MerchantBankAccountQuery.merchant_bank_accounts,
        merchant_bank_account_logs: MerchantBankAccountLogQuery.merchant_bank_account_logs,

        transactions: transactionQuery.transactions,
        transaction_details: transactionQuery.transaction_details,
        transactions_line: transactionQuery.transactions_line,
        transactions_pie: transactionQuery.transactions_pie,

        bank_fee_rate: BankBranchQuery.bank_fee_rate,
        selected_bank_fee_rate: BankBranchQuery.selected_bank_fee_rate,
        bank_fee_rate_log: BankBranchQuery.bank_fee_rate_log,
        agent_fee_rate: agentQuery.agent_fee_rate,
        selected_agent_fee_rate: agentQuery.selected_agent_fee_rate,
        agent_fee_rate_log: agentQuery.agent_fee_rate_log,
        merchant_fee_rate: MerchantQuery.merchant_fee_rate,
        merchant_fee_rate_log: MerchantQuery.merchant_fee_rate_log,
    }
})