const BaseModel = require('../baseModel/base')

class Client extends BaseModel {
    static get TABLE_NAME() {
        return 'client'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['ten', 'maso', 'maso_dk', 'so_cccd']
    }
}

module.exports = Client