const BaseModel = require('../baseModel/base')

class UserCategory extends BaseModel {
    static get TABLE_NAME() {
        return 'user_category'
    }
    
    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = UserCategory