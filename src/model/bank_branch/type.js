let {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
// Defines the type
const Bank = require('../bank/bank')
const BankCard = require('./loai_the')
const BankCardType = require('./type_loai_the')
module.exports = new GraphQLObjectType({
    name: 'BankBranch',
    description: 'A Bank Branch',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        bank_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        bank_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let b = await Bank.executeQueryString(`SELECT b.* from bank b where b.soft_deleted = 0 and b.id = ${ obj.bank_id }`);
                return b && b.length > 0 ? b[0].ten_bank : '';
            }
        },
        ten_chi_nhanh: {
            type: GraphQLString
        },
        ma_chi_nhanh: {
            type: GraphQLString
        },
        dia_chi: {
            type: GraphQLString
        },
        loai_dvkd: {
            type: GraphQLInt
        },
        ngay_bat_dau: {
            type: GraphQLString
        },
        ho_so_file: {
            type: GraphQLString
        },
        loai_the: {
            type: new GraphQLList(BankCardType),
            resolve: async(obj) => {
                return await BankCard.executeQueryString(`SELECT m.* from dvkd_loai_the m where m.soft_deleted = 0 and m.chi_nhanh_bank_id = ${ obj.id }`);
            }
        },
        status: {
            type: GraphQLInt
        },
        soft_deleted: {
            type: GraphQLBoolean
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