const {
    GraphQLString,
    GraphQLInt,
} = require('graphql')
const type = require('./type')
const Client = require('./client')

// Defines the mutations
module.exports = {
    addClient: {
        type,
        args: {
            ten: { type: GraphQLString },
            type: { type: GraphQLInt },
            maso: { type: GraphQLString },
            maso_dk: { type: GraphQLString },
            ngay_cap_dk: { type: GraphQLString },
            noi_cap_dk: { type: GraphQLString },
            diachi_kinhdoanh: { type: GraphQLString },
            quan_huyen: { type: GraphQLString },
            tinh_tp: { type: GraphQLString },
            loai_hinh_kd: { type: GraphQLInt },
            chu_ho_kd: { type: GraphQLString },
            gioi_tinh: { type: GraphQLString },
            ngay_sinh: { type: GraphQLString },
            so_cccd: { type: GraphQLString },
            ngay_cap: { type: GraphQLString },
            noi_cap: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            sdt: { type: GraphQLString },
            email: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            const client = await Client.createEntry(_, {
                ten: args.ten,
                type: args.type,
                maso: args.maso,
                maso_dk: args.maso_dk,
                ngay_cap_dk: args.ngay_cap_dk,
                noi_cap_dk: args.noi_cap_dk,
                diachi_kinhdoanh: args.diachi_kinhdoanh,
                quan_huyen: args.quan_huyen,
                tinh_tp: args.tinh_tp,
                loai_hinh_kd: args.loai_hinh_kd,
                chu_ho_kd: args.chu_ho_kd,
                gioi_tinh: args.gioi_tinh,
                ngay_sinh: args.ngay_sinh,
                so_cccd: args.so_cccd,
                ngay_cap: args.ngay_cap,
                noi_cap: args.noi_cap,
                dia_chi: args.dia_chi,
                sdt: args.sdt,
                email: args.email,
                status: 0,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            });
            return client
        }
    },

    updateClient: {
        type,
        args: {
            id: { type: GraphQLInt },
            ten: { type: GraphQLString },
            type: { type: GraphQLInt },
            maso: { type: GraphQLString },
            maso_dk: { type: GraphQLString },
            ngay_cap_dk: { type: GraphQLString },
            noi_cap_dk: { type: GraphQLString },
            diachi_kinhdoanh: { type: GraphQLString },
            quan_huyen: { type: GraphQLString },
            tinh_tp: { type: GraphQLString },
            loai_hinh_kd: { type: GraphQLInt },
            chu_ho_kd: { type: GraphQLString },
            gioi_tinh: { type: GraphQLString },
            ngay_sinh: { type: GraphQLString },
            so_cccd: { type: GraphQLString },
            ngay_cap: { type: GraphQLString },
            noi_cap: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            sdt: { type: GraphQLString },
            email: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            const client = await Client.findOne(_, [], {id: args.id})
            if (!client || !client.id) {
                throw new Error('Client not found!')
            }
            const newClient = await Client.updateEntry(_, {id: args.id, fields: {
                ten: args.ten ? args.ten : client.ten,
                type: args.type || args.type == 0 ? args.type : client.type,
                maso: args.maso ? args.maso : client.maso,
                maso_dk: args.maso_dk ? args.maso_dk : client.maso_dk,
                ngay_cap_dk: args.ngay_cap_dk ? args.ngay_cap_dk : client.ngay_cap_dk,
                noi_cap_dk: args.noi_cap_dk ? args.noi_cap_dk : client.noi_cap_dk,
                diachi_kinhdoanh: args.diachi_kinhdoanh ? args.diachi_kinhdoanh : client.diachi_kinhdoanh,
                quan_huyen: args.quan_huyen ? args.quan_huyen : client.quan_huyen,
                tinh_tp: args.tinh_tp ? args.tinh_tp : client.tinh_tp,
                loai_hinh_kd: args.loai_hinh_kd || args.loai_hinh_kd == 0 ? args.loai_hinh_kd : client.loai_hinh_kd,
                chu_ho_kd: args.chu_ho_kd ? args.chu_ho_kd : client.chu_ho_kd,
                gioi_tinh: args.gioi_tinh ? args.gioi_tinh : client.gioi_tinh,
                ngay_sinh: args.ngay_sinh ? args.ngay_sinh : client.ngay_sinh,
                so_cccd: args.so_cccd ? args.so_cccd : client.so_cccd,
                ngay_cap: args.ngay_cap ? args.ngay_cap : client.ngay_cap,
                noi_cap: args.noi_cap ? args.noi_cap : client.noi_cap,
                dia_chi: args.dia_chi ? args.dia_chi : client.dia_chi,
                sdt: args.sdt ? args.sdt : client.sdt,
                email: args.email ? args.email : client.email,
                modified_date: new Date(),
                modified_by: args.user_id
            }});
            return newClient
        }
    },
}