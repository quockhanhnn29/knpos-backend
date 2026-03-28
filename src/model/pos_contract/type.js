let {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql')
const Pos = require('../pos/pos')
const PosProvider = require('../pos_provider/pos_provider')
const SupplierPos = require('../supplier_pos/supplier_pos')
const SupplierPosModel = require('../pos_model/pos_model')
const PosLogType = require('../pos_contract_log/type')
const PosLog = require('../pos_contract_log/pos_contract_log')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'PosContract',
    description: 'A pos contract',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        so_hd: {
            type: GraphQLString
        },
        provider_id: {
            type: GraphQLInt
        },
        provider_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await PosProvider.executeQueryString(`select p.* from pos_contract c join pos_provider p on p.id = c.provider_id where p.id = ${ obj.provider_id }`)
                return c && c.length ? c[0].ten : '';
            }
        },
        supplier_id: {
            type: GraphQLInt
        },
        supplier_name: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await SupplierPos.executeQueryString(`select p.* from pos_contract c join supplier_pos p on p.id = c.supplier_id where p.id = ${ obj.supplier_id }`)
                return c && c.length ? c[0].ten : '';
            }
        },
        loai_may_id: {
            type: GraphQLInt
        },
        loai_may: {
            type: GraphQLString,
            resolve: async(obj) => {
                let c = await SupplierPosModel.executeQueryString(`select p.* from pos_contract c join supplier_pos_model p on p.id = c.loai_may_id where p.id = ${ obj.loai_may_id }`)
                return c && c.length ? c[0].ten : '';
            }
        },
        pos_total: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.contract_id = ${ obj.id }`);
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_received: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.loai_kho = 0 and p.contract_id = ${ obj.id }`)
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_paid: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.thanh_toan = 1 and p.contract_id = ${ obj.id }`)
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_hoan_tra: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.hoan_tra = 1 and p.contract_id = ${ obj.id }`)
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_ready_received: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.loai_kho = 0 and p.status = 0 and p.contract_id = ${ obj.id }`)
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_ready_number_only: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.loai_kho = 1 and p.status = 0 and p.contract_id = ${ obj.id }`)
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_hong: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let t = await Pos.executeQueryString(`select count(p.id) as total from pos_contract c join pos p on p.contract_id = c.id where p.status = 3 and p.contract_id = ${ obj.id }`)
                return t && t.length ? t[0].total : 0;
            }
        },
        pos_contract_log: {
            type: new GraphQLList(PosLogType),
            resolve: async(obj) => {
                return await PosLog.executeQueryString(`select p.* from pos_contract_log p where p.contract_id = ${ obj.id }`)
            }
        },
        ngay_ky: {
            type: GraphQLString
        },
        attachments: {
            type: GraphQLString
        },
        status: {
            type: GraphQLInt
            // 0-đang cấp 1-đã cấp 2-hoàn thành
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
        },
    }
})