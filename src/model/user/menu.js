const BaseModel = require('../baseModel/base')

class Menu extends BaseModel {
    static get TABLE_NAME() {
        return 'menu'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = Menu