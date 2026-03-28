const BaseModel = require('../baseModel/base')

class MerchantChecklistProcess extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_checklist_process'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantChecklistProcess