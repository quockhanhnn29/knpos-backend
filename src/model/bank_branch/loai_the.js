const BaseModel = require('../baseModel/base')

class BankCard extends BaseModel {
    static get TABLE_NAME() {
        return 'dvkd_loai_the'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = BankCard