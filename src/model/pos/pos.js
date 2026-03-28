const BaseModel = require('../baseModel/base')

class Pos extends BaseModel {
    static get TABLE_NAME() {
        return 'pos'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = Pos