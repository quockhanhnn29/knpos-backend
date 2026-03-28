const BaseModel = require('../baseModel/base')

class TransactionTransfer extends BaseModel {
    static get TABLE_NAME() {
        return 'kn_transaction_transfer'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = TransactionTransfer