const BaseModel = require('../baseModel/base')

class AgentFeeRateLog extends BaseModel {
    static get TABLE_NAME() {
        return 'agent_fee_rate_log'
    }

    static get QUICK_SEARCH_FIELDS() {
        return []
    }
}

module.exports = AgentFeeRateLog