const BaseModel = require('../baseModel/base')

class UserTag extends BaseModel {
    static get TABLE_NAME() {
        return 'user_tag'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = UserTag