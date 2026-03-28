let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList
} = require('graphql')
// Defines the type
const Agent = require('../agent/agent')
const MerchantBank = require('../merchant_bank/merchant_bank')
const Bank = require('../bank/bank')
module.exports = new GraphQLObjectType({
    name: 'Transaction',
    description: 'A Transaction',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        ten_dvcnt: {
            type: GraphQLString
        },
        mid: {
            type: GraphQLString
        },
        tid: {
            type: GraphQLString
        },
        merchant_bank: {
            type: GraphQLString,
            resolve: async(obj) => {
                let m = await MerchantBank.executeQueryString(`select mb.* from merchant_bank mb where mb.soft_deleted = 0 and mb.tid = "${ obj.tid }" and mb.bank_id = ${ obj.bank_id }`);
                return m && m.length ? m[0].ten_hkd_bank : '';
            }
        },
        bank_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let m = await Bank.executeQueryString(`select * from bank where id = ${ obj.bank_id }`);
                return m && m.length ? m[0].ten_bank : '';
            }
        },
        agent: {
            type: GraphQLString,
            resolve: async(obj) => {
                let a = await Agent.executeQueryString(`select a.* from merchant_bank mb join merchant m on mb.merchant_id = m.id join agent a on m.agent_id = a.id where mb.tid = "${ obj.tid }" and mb.bank_id = ${ obj.bank_id }`);
                return a && a.length ? a[0].ten_dai_ly : '';
            }
        },
        date_from: {
            type: GraphQLString
        },
        date_to: {
            type: GraphQLString
        },
        so_gd: {
            type: GraphQLInt,
        },
        time_gd: {
            type: GraphQLString
        },
        tong_gd: {
            type: GraphQLString
        },
        tong_bc: {
            type: GraphQLString
        },
        tong_phi: {
            type: GraphQLString
        },
        bank_id: {
            type: GraphQLInt
        },
        so_the: {
            type: GraphQLString
        },
        so_tien_gd: {
            type: GraphQLInt
        },
        so_tien_bc: {
            type: GraphQLInt
        },
        so_tien_phi: {
            type: GraphQLInt
        },
        time_bc: {
            type: GraphQLString
        },
        loai_the: {
            type: GraphQLString
        },
        ma_chuan_chi: {
            type: GraphQLString
        },
        so_but_toan: {
            type: GraphQLString
        },
        so_tc: {
            type: GraphQLString
        },
        batch: {
            type: GraphQLString
        },
        timestamp: {
            type: GraphQLString
        },
        section_id: {
            type: GraphQLString
        },
        user_id: {
            type: GraphQLInt
        }
    }
})