const BaseModel = require('../baseModel/base')

class Agent extends BaseModel {
    static get TABLE_NAME() {
        return 'agent'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['ten_dai_ly']
    }
}

module.exports = Agent