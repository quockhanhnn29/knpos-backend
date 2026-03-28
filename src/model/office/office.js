const BaseModel = require('../baseModel/base')

class Office extends BaseModel {
    static get TABLE_NAME() {
        return 'offices'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['office_name']
    }
}

module.exports = Office