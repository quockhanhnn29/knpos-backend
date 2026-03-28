let {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql')
const BankCard = require('../bank_branch/loai_the')
const BankFeeRate = require('../bank_branch/fee_rate')
module.exports = new GraphQLObjectType({
  name: 'MerchantFeeRate',
  description: 'A Fee Rate For Merchant',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    merchant_id: {
      type: new GraphQLNonNull(GraphQLInt)
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
        let t = await BankFeeRate.executeQueryString(`select a.* from dvkd_fee_rate a join merchant m on a.chi_nhanh_bank_id = m.chi_nhanh_bank_id and a.loai_hinh_kd_id = m.loai_hinh_kd where a.soft_deleted = 0 and a.loai_the_id = ${ obj.loai_the_id } and m.id = ${ obj.merchant_id }`)
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