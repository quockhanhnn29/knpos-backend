const BaseModel = require('../baseModel/base')

class MerchantChecklist extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_checklist'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantChecklist