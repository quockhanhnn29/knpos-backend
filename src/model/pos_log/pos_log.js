const BaseModel = require('../baseModel/base')

class PosLog extends BaseModel {
    static get TABLE_NAME() {
        return 'pos_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = PosLog