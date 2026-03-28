const BaseModel = require('../baseModel/base')

class Bank extends BaseModel {
    static get TABLE_NAME() {
        return 'bank'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['ten_bank']
    }
}

module.exports = Bank