const BaseModel = require('../baseModel/base')

class UserRole extends BaseModel {
    static get TABLE_NAME() {
        return 'user_role'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = UserRole