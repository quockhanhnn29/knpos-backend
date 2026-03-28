const {
    GraphQLString,
    GraphQLInt,
    GraphQLFloat
} = require('graphql')
const type = require('./type')
const Agent = require('./agent')
const { GraphQLUpload } = require('graphql-upload')
const { storeUpload } = require('./../../util/util')
const type_fee_rate = require('./type_fee_rate')
const AgentFeeRate = require('./fee_rate')
const AgentFeeRateLog = require('./fee_rate_log')
const moment = require('moment')

// Defines the mutations
module.exports = {
    addAgent: {
        type,
        args: {
            ten_dai_ly: { type: GraphQLString },
            ten_dai_dien: { type: GraphQLString },
            gioi_tinh: { type: GraphQLString },
            ngay_sinh: { type: GraphQLString },
            so_cccd: { type: GraphQLString },
            ngay_cap: { type: GraphQLString },
            noi_cap: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            sdt: { type: GraphQLString },
            email: { type: GraphQLString },
            ngay_bat_dau: { type: GraphQLString },
            ngay_ket_thuc: { type: GraphQLString },
            kn_office_id: { type: GraphQLInt },
            status: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
            hop_dong: {
                description: 'Upload file.',
                type: GraphQLUpload
            }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            let hop_dong = '';
            if (args.hop_dong) {
                let file = await storeUpload(args.hop_dong, process.env.UPLOAD_DIR)
                hop_dong = file.path;
            }
            const agent = await Agent.createEntry(_, {
                ten_dai_ly: args.ten_dai_ly,
                ten_dai_dien: args.ten_dai_dien,
                gioi_tinh: args.gioi_tinh,
                ngay_sinh: args.ngay_sinh,
                so_cccd: args.so_cccd,
                ngay_cap: args.ngay_cap,
                noi_cap: args.noi_cap,
                dia_chi: args.dia_chi,
                sdt: args.sdt,
                email: args.email,
                ngay_bat_dau: args.ngay_bat_dau ? args.ngay_bat_dau : new Date(),
                ngay_ket_thuc: args.ngay_ket_thuc ? args.ngay_ket_thuc : null,
                hop_dong: hop_dong ? hop_dong : null,
                kn_office_id: args.kn_office_id,
                status: args.status,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id,
            });
            return agent
        }
    },
    updateAgent: {
        type,
        args: {
            id: { type: GraphQLInt },
            ten_dai_ly: { type: GraphQLString },
            ten_dai_dien: { type: GraphQLString },
            gioi_tinh: { type: GraphQLString },
            ngay_sinh: { type: GraphQLString },
            so_cccd: { type: GraphQLString },
            ngay_cap: { type: GraphQLString },
            noi_cap: { type: GraphQLString },
            dia_chi: { type: GraphQLString },
            sdt: { type: GraphQLString },
            email: { type: GraphQLString },
            ngay_bat_dau: { type: GraphQLString },
            ngay_ket_thuc: { type: GraphQLString },
            kn_office_id: { type: GraphQLInt },
            status: { type: GraphQLInt },
            soft_deleted: { type: GraphQLInt },
            user_id: { type: GraphQLInt },
            hop_dong: {
                description: 'Upload file.',
                type: GraphQLUpload
            }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const agent = await Agent.findOne(_, [], {id: args.id})
            if (!agent || !agent.id) {
                throw new Error('Agent not found!')
            }
            let hop_dong = '';
            if (args.hop_dong) {
                let file = await storeUpload(args.hop_dong, process.env.UPLOAD_DIR)
                hop_dong = file.path;
            }
            const newAgent = await Agent.updateEntry(_, {id: args.id, fields: {
                ten_dai_ly: args.ten_dai_ly,
                ten_dai_dien: args.ten_dai_dien,
                gioi_tinh: args.gioi_tinh,
                ngay_sinh: args.ngay_sinh,
                so_cccd: args.so_cccd,
                ngay_cap: args.ngay_cap,
                noi_cap: args.noi_cap,
                dia_chi: args.dia_chi,
                sdt: args.sdt,
                email: args.email,
                ngay_bat_dau: args.ngay_bat_dau ? args.ngay_bat_dau : agent.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc ? args.ngay_ket_thuc : agent.ngay_ket_thuc,
                hop_dong: hop_dong ? hop_dong : agent.hop_dong,
                kn_office_id: args.kn_office_id,
                status: args.status,
                soft_deleted: args.soft_deleted,
                modified_date: new Date(),
                modified_by: args.user_id,
            }});
            return newAgent
        }
    },
    addAgentFeeRate: {
        type: type_fee_rate,
        args: {
            agent_id: { type: GraphQLInt },
            chi_nhanh_bank_id: { type: GraphQLInt },
            loai_hinh_kd_id: { type: GraphQLInt },
            loai_the_id: { type: GraphQLInt },
            phi_cai_pos: { type: GraphQLFloat },
            phi_ban_agent: { type: GraphQLFloat },
            ngay_bat_dau: { type: GraphQLString },
            ngay_ket_thuc: { type: GraphQLString },
            tsl_from: { type: GraphQLString },
            tsl_to: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const agent = await AgentFeeRate.createEntry(_, {
                agent_id: args.agent_id,
                chi_nhanh_bank_id: args.chi_nhanh_bank_id,
                loai_hinh_kd_id: args.loai_hinh_kd_id,
                loai_the_id: args.loai_the_id,
                phi_cai_pos: args.phi_cai_pos ? args.phi_cai_pos : null,
                phi_ban_agent: args.phi_ban_agent ? args.phi_ban_agent : null,
                ngay_bat_dau: args.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc ? args.ngay_ket_thuc : null,
                tsl_from: args.tsl_from != '0' ? args.tsl_from : null,
                tsl_to: args.tsl_to != '0' ? args.tsl_to : null,
                soft_deleted: 0,
                created_date: new Date(),
                modified_date: new Date(),
                modified_by: args.user_id
            })
            let info = `Cài - ${args.phi_cai_pos}, Bán - ${args.phi_ban_agent}. Hiệu lực từ ${moment(args.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (args.ngay_ket_thuc) {
                info += ` đến ${moment(args.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            if (args.tsl_from && (!args.tsl_to || args.tsl_to == '0')) {
                info = `Trên ${args.tsl_from}: ` + info;
            } else if (args.tsl_from && args.tsl_from != '0' && args.tsl_to && args.tsl_to != '0') {
                info = `Từ ${args.tsl_from} đến ${args.tsl_to}: ` + info;
            } else if ((!args.tsl_from || args.tsl_from == '0') && args.tsl_to) {
                info = `Dưới ${args.tsl_to}: ` + info;
            }
            await AgentFeeRateLog.createEntry(_, {
                agent_fee_rate_id: agent.id,
                agent_id: args.agent_id,
                thong_tin_cu: null,
                thong_tin_moi: info,
                timestamp: new Date(),
                user_id: args.user_id
            })
            return agent
        }
    },
    updateAgentFeeRate: {
        type: type_fee_rate,
        args: {
            id: { type: GraphQLInt },
            agent_id: { type: GraphQLInt },
            chi_nhanh_bank_id: { type: GraphQLInt },
            loai_hinh_kd_id: { type: GraphQLInt },
            loai_the_id: { type: GraphQLInt },
            phi_cai_pos: { type: GraphQLFloat },
            phi_ban_agent: { type: GraphQLFloat },
            ngay_bat_dau: { type: GraphQLString },
            ngay_ket_thuc: { type: GraphQLString },
            tsl_from: { type: GraphQLString },
            tsl_to: { type: GraphQLString },
            user_id: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const current = await AgentFeeRate.findOne(_, [], {id: args.id});
            if (!current || !current.id) {
                throw new Error('Item not found!')
            }
            let old_info = `Cài - ${current.phi_cai_pos}, Bán - ${current.phi_ban_agent}. Hiệu lực từ ${moment(current.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (current.ngay_ket_thuc) {
                old_info += ` đến ${moment(current.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            if (current.tsl_from && (!current.tsl_to || current.tsl_to == '0')) {
                old_info = `Trên ${current.tsl_from}: ` + old_info;
            } else if (current.tsl_from && current.tsl_from != '0' && current.tsl_to && current.tsl_to != '0') {
                old_info = `Từ ${current.tsl_from} đến ${current.tsl_to}: ` + old_info;
            } else if ((!current.tsl_from || current.tsl_from == '0') && current.tsl_to) {
                old_info = `Dưới ${current.tsl_to}: ` + old_info;
            }

            let info = `Cài - ${args.phi_cai_pos}, Bán - ${args.phi_ban_agent}. Hiệu lực từ ${moment(args.ngay_bat_dau).format('DD/MM/YYYY')}`;
            if (args.ngay_ket_thuc) {
                info += ` đến ${moment(args.ngay_ket_thuc).format('DD/MM/YYYY')}`;
            }
            if (args.tsl_from && (!args.tsl_to || args.tsl_to == '0')) {
                info = `Trên ${args.tsl_from}: ` + info;
            } else if (args.tsl_from && args.tsl_from != '0' && args.tsl_to && args.tsl_to != '0') {
                info = `Từ ${args.tsl_from} đến ${args.tsl_to}: ` + info;
            } else if ((!args.tsl_from || args.tsl_from == '0') && args.tsl_to) {
                info = `Dưới ${args.tsl_to}: ` + info;
            }
            await AgentFeeRateLog.createEntry(_, {
                agent_fee_rate_id: args.id,
                agent_id: args.agent_id,
                thong_tin_cu: old_info,
                thong_tin_moi: info,
                timestamp: new Date(),
                user_id: args.user_id
            })
            const bank = await AgentFeeRate.updateEntry(_, {id: args.id, fields: {
                phi_cai_pos: args.phi_cai_pos,
                phi_ban_agent: args.phi_ban_agent,
                ngay_bat_dau: args.ngay_bat_dau,
                ngay_ket_thuc: args.ngay_ket_thuc,
                tsl_from: args.tsl_from != '0' ? args.tsl_from : null,
                tsl_to: args.tsl_to != '0' ? args.tsl_to : null,
                modified_date: new Date(),
                modified_by: args.user_id
            }})
            return bank
        }
    },
}