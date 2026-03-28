const BaseModel = require('../baseModel/base')

class BankFeeRate extends BaseModel {
    static get TABLE_NAME() {
        return 'dvkd_fee_rate'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = BankFeeRate