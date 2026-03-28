const BaseModel = require('../baseModel/base')

class PosModel extends BaseModel {
    static get TABLE_NAME() {
        return 'supplier_pos_model'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = PosModel