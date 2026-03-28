const BaseModel = require('../baseModel/base')

class MerchantBankAccountLog extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_bank_account_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantBankAccountLog