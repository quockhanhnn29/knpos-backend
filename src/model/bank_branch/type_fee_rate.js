let {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql')
const MerchantBus = require('../merchant_type/merchant_type')
const BankCard = require('./loai_the')
module.exports = new GraphQLObjectType({
  name: 'BankFeeRate',
  description: 'A Fee Rate For Bank Branch',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    chi_nhanh_bank_id: {
      type: new GraphQLNonNull(GraphQLInt)
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
      type: GraphQLFloat
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