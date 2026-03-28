const BaseModel = require('../baseModel/base')

class SupplierPos extends BaseModel {
    static get TABLE_NAME() {
        return 'supplier_pos'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['ten']
    }
}

module.exports = SupplierPos