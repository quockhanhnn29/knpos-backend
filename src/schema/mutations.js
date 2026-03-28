const { GraphQLObjectType } = require('graphql')
const userMutation = require('../model/user/mutations')
const merchantMutation = require('../model/merchant/mutation')
const transactionMutation = require('../model/transaction/mutation')
const merchantBankAccountMutation = require('../model/merchant_bank_account/mutation')
const clientMutation = require('../model/client/mutation')
const posMutation = require('../model/pos/mutation')
const posContractMutation = require('../model/pos_contract/mutation')

const officeMutation = require('../model/office/mutation')
const merchantTypeMutation = require('../model/merchant_type/mutation')
const posProviderMutation = require('../model/pos_provider/mutation')
const supplierPosMutation = require('../model/supplier_pos/mutation')
const bankMutation = require('../model/bank/mutation')
const bankBranchMutation = require('../model/bank_branch/mutation')
const agentMutation = require('../model/agent/mutation')

module.exports = new GraphQLObjectType({
    name: 'RootMutationsType',
    fields: {
        addUser: userMutation.addUser,
        updateUser: userMutation.updateUser,
        removeUser: userMutation.removeUser,
        login: userMutation.login,
        resetPassword: userMutation.resetPassword,
        changePassword: userMutation.changePassword,

        addClient: clientMutation.addClient,
        updateClient: clientMutation.updateClient,
        addMerchant: merchantMutation.addMerchant,
        updateMerchant: merchantMutation.updateMerchant,
        addMerchantBank: merchantMutation.addMerchantBank,
        updateMerchantBank: merchantMutation.updateMerchantBank,
        addCustomMerchantLog: merchantMutation.addCustomMerchantLog,
        updateChecklistProcess: merchantMutation.updateChecklistProcess,
        updateMerchantBankAccount: merchantBankAccountMutation.updateMerchantBankAccount,
        returnPOS: posMutation.returnPOS,
        updatePOSOffice: posMutation.updatePOSOffice,
        updatePOSStatus: posMutation.updatePOSStatus,
        addPosContract: posContractMutation.addPosContract,
        importListPos: posContractMutation.importListPos,
        importHDBankData: transactionMutation.importHDBankData,
        importVPBankData: transactionMutation.importVPBankData,
        importVPBankHoldData: transactionMutation.importVPBankHoldData,
        resolveVPBankHoldData: transactionMutation.resolveVPBankHoldData,
        importVPBankTransferData: transactionMutation.importVPBankTransferData,
        importBIDVData: transactionMutation.importBIDVData,

        addOffice: officeMutation.addOffice,
        updateOffice: officeMutation.updateOffice,
        addMerchantBusType: merchantTypeMutation.addMerchantBusType,
        updateMerchantBusType: merchantTypeMutation.updateMerchantBusType,
        addProviderPos: posProviderMutation.addProviderPos,
        updateProviderPos: posProviderMutation.updateProviderPos,
        addSupplierPos: supplierPosMutation.addSupplierPos,
        updateSupplierPos: supplierPosMutation.updateSupplierPos,
        addBank: bankMutation.addBank,
        updateBank: bankMutation.updateBank,
        addBankBranch: bankBranchMutation.addBankBranch,
        updateBankBranch: bankBranchMutation.updateBankBranch,
        addAgent: agentMutation.addAgent,
        updateAgent: agentMutation.updateAgent,

        addBankBranchFeeRate: bankBranchMutation.addBankBranchFeeRate,
        updateBankBranchFeeRate: bankBranchMutation.updateBankBranchFeeRate,
        addAgentFeeRate: agentMutation.addAgentFeeRate,
        updateAgentFeeRate: agentMutation.updateAgentFeeRate,
        addMerchantFeeRate: merchantMutation.addMerchantFeeRate,
        updateMerchantFeeRate: merchantMutation.updateMerchantFeeRate,
    }
})