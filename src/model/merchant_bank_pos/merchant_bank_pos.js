const BaseModel = require('../baseModel/base')

class MerchantBankPos extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_bank_pos'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['mid', 'tid']
    }
}

module.exports = MerchantBankPos