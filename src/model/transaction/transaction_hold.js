const BaseModel = require('../baseModel/base')

class TransactionHold extends BaseModel {
    static get TABLE_NAME() {
        return 'kn_transaction_hold'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = TransactionHold