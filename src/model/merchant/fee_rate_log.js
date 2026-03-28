const BaseModel = require('../baseModel/base')

class MerchantFeeRateLog extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_fee_rate_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantFeeRateLog