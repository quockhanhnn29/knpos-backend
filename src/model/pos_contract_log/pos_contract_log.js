const BaseModel = require('../baseModel/base')

class PosContractLog extends BaseModel {
    static get TABLE_NAME() {
        return 'pos_contract_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = PosContractLog