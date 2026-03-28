const BaseModel = require('../baseModel/base')

class Transaction extends BaseModel {
    static get TABLE_NAME() {
        return 'kn_transaction'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = Transaction