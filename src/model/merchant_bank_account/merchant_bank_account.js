const BaseModel = require('../baseModel/base')

class MerchantBankAccount extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_bank_account'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantBankAccount