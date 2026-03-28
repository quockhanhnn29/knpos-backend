let {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql')
const MerchantBus = require('../merchant_type/merchant_type')
const BankCard = require('../bank_branch/loai_the')
const BankFeeRate = require('../bank_branch/fee_rate')
const BankBranch = require('../bank_branch/bank_branch')
const Bank = require('../bank/bank')

module.exports = new GraphQLObjectType({
  name: 'AgentFeeRate',
  description: 'A Fee Rate For Agent',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    agent_id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    chi_nhanh_bank_id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    bank_id: {
      type: GraphQLInt,
      resolve: async(obj) => {
        let t = await BankBranch.executeQueryString(`select a.* from bank_branch a where a.soft_deleted = 0 and a.id = ${ obj.chi_nhanh_bank_id }`)
        return t && t.length ? t[0].bank_id : 0;
      }
    },
    ten_bank: {
      type: GraphQLString,
      resolve: async(obj) => {
        let t = await Bank.executeQueryString(`select b.* from bank_branch a join bank b on b.id = a.bank_id where a.soft_deleted = 0 and a.id = ${ obj.chi_nhanh_bank_id }`)
        return t && t.length ? t[0].ten_bank : 0;
      }
    },
    ten_chi_nhanh: {
      type: GraphQLString,
      resolve: async(obj) => {
        let t = await BankBranch.executeQueryString(`select a.* from bank_branch a where a.soft_deleted = 0 and a.id = ${ obj.chi_nhanh_bank_id }`)
        return t && t.length ? t[0].ten_chi_nhanh : '';
      }
    },
    loai_hinh_kd_id: {
      type: GraphQLInt
    },
    ten_loai_hinh_kd: {
      type: GraphQLString,
      resolve: async(obj) => {
        let t = await MerchantBus.executeQueryString(`select a.* from merchant_bus_type a where a.status = 0 and a.id = ${ obj.loai_hinh_kd_id }`)
        return t && t.length ? t[0].ten : '';
      }
    },
    loai_the_id: {
      type: GraphQLInt
    },
    ten_loai_the: {
      type: GraphQLString,
      resolve: async(obj) => {
        let t = await BankCard.executeQueryString(`select a.* from dvkd_loai_the a where a.soft_deleted = 0 and a.id = ${ obj.loai_the_id }`)
        return t && t.length ? t[0].ten_doi_soat : '';
      }
    },
    phi_goc: {
      type: GraphQLFloat,
      resolve: async(obj) => {
        let t = await BankFeeRate.executeQueryString(`select a.* from dvkd_fee_rate a where a.soft_deleted = 0 and a.chi_nhanh_bank_id = ${ obj.chi_nhanh_bank_id } and a.loai_hinh_kd_id = ${ obj.loai_hinh_kd_id } and a.loai_the_id = ${ obj.loai_the_id }`)
        return t && t.length ? t[0].phi_goc : 0;
      }
    },
    phi_cai_pos: {
      type: GraphQLFloat
    },
    phi_ban_agent: {
      type: GraphQLFloat
    },
    ngay_bat_dau: {
      type: GraphQLString
    },
    ngay_ket_thuc: {
      type: GraphQLString
    },
    tsl_from: {
      type: GraphQLString
    },
    tsl_to: {
      type: GraphQLString
    },
    soft_deleted: {
      type: GraphQLInt
    },
    created_date: {
      type: GraphQLString
    },
    modified_date: {
      type: GraphQLString
    },
    modified_by: {
      type: GraphQLInt
    }
  }
})