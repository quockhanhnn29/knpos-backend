const BaseModel = require('../baseModel/base')

class WebConfig extends BaseModel {
    static get TABLE_NAME() {
        return 'web_config'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = WebConfig