const BaseModel = require('../baseModel/base')

class BankFeeRateLog extends BaseModel {
    static get TABLE_NAME() {
        return 'dvkd_fee_rate_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = BankFeeRateLog