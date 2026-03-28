const BaseModel = require('../baseModel/base')

class Category extends BaseModel {
    static get TABLE_NAME() {
        return 'categories'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['category_name']
    }
}

module.exports = Category