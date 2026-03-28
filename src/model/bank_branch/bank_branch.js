const BaseModel = require('../baseModel/base')

class BankBranch extends BaseModel {
    static get TABLE_NAME() {
        return 'bank_branch'
    }

    static get QUICK_SEARCH_FIELDS() {
        return ['ten_chi_nhanh']
    }
}

module.exports = BankBranch