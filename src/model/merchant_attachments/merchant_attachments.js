const BaseModel = require('../baseModel/base')

class MerchantAttachment extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_attachment'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantAttachment