const BaseModel = require('../baseModel/base')

class MerchantFeeRate extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_fee_rate'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantFeeRate