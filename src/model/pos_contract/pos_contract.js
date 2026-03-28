const BaseModel = require('../baseModel/base')

class PosContract extends BaseModel {
    static get TABLE_NAME() {
        return 'pos_contract'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = PosContract