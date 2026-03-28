const BaseModel = require('../baseModel/base')

class Role extends BaseModel {
    static get TABLE_NAME() {
        return 'roles'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = Role