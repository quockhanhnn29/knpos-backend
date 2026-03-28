const BaseModel = require('../baseModel/base')

class AgentFeeRate extends BaseModel {
    static get TABLE_NAME() {
        return 'agent_fee_rate'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = AgentFeeRate