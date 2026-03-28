const BaseModel = require('../baseModel/base')

class MerchantLog extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantLog