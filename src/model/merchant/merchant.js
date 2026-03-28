const BaseModel = require('../baseModel/base')

class Merchant extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = Merchant