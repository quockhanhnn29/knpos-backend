const BaseModel = require('../baseModel/base')

class UserPermission extends BaseModel {
    static get TABLE_NAME() {
        return 'user_permission'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = UserPermission