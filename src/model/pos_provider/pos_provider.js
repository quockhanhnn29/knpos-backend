const BaseModel = require('../baseModel/base')

class ProviderPos extends BaseModel {
    static get TABLE_NAME() {
        return 'pos_provider'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['ten']
    }
}

module.exports = ProviderPos