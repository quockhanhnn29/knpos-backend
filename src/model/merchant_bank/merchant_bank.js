const BaseModel = require('../baseModel/base')

class MerchantBank extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_bank'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['mid', 'tid']
    }
}

module.exports = MerchantBank