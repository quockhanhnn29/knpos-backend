const BaseModel = require('../baseModel/base')

class Tag extends BaseModel {
    static get TABLE_NAME() {
        return 'tags'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['tag_name']
    }
}

module.exports = Tag