const BaseModel = require('../baseModel/base')

class MerchantBusType extends BaseModel {
    static get TABLE_NAME() {
        return 'merchant_bus_type'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = MerchantBusType