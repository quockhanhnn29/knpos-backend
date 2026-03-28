const {
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const shortid = require('shortid')
const lodash = require('lodash')
const utils = require('../../util/util')
const { GraphQLUpload } = require('graphql-upload')

const { storeUpload } = require('./../../util/util')
const type = require('./type')
const User = require('./user')
const UserRole = require('../user_role/user_role')
const UserPermission = require('./user_permission')
const { UserRoleEnumType } = require('../user_role/enums')
const UserTag = require('../user_tag/user_tag')
const UserCategory = require('../user_category/user_category');


// Defines the mutations
module.exports = {
    addUser: {
        type,
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString },
            user_name: { type: GraphQLString },
            manager_id: { type: GraphQLInt },
            category_id: { type: new GraphQLList(GraphQLInt) },
            tag_id: { type: new GraphQLList(GraphQLInt) },
            role_id: { type: new GraphQLList(GraphQLInt) },
            kn_office_id: { type: GraphQLInt },
            gender: { type: GraphQLInt },
            birthday: { type: GraphQLString },
            phone_number: { type: GraphQLString },
            f_image: { type: GraphQLString },
            default_permission: { type: GraphQLInt },
            menu_permission: { type: GraphQLString },
            avatar_upload: {
                description: 'Upload image.',
                type: GraphQLUpload
            }
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }
            const checkUser = await User.findOne(_, [], {'email': args.email})
            if (checkUser) {
                throw new Error('The email has existed!')
            }
            if (!args.f_image && args.avatar_upload) {
                const file = await storeUpload(args.avatar_upload, process.env.IMAGE_DIR)
                args.f_image = file.path
            }
            //create user
            const user = await User.createEntry(_, { fields: {
                email: args.email,
                password: await bcrypt.hash(args.password, 10),
                user_name: args.user_name,
                manager_id: args.manager_id,
                gender: args.gender,
                birthday: args.birthday,
                phone_number: args.phone_number,
                f_image: args.f_image,
                kn_office_id: args.kn_office_id,
                soft_deleted: 0
            }})
            //create user_role
            args.role_id.forEach(async role_id => {
                await UserRole.createEntry(_, { user_id: user.id, role_id })
            })
            //create user_tag
            args.tag_id.forEach(async tag_id => {
                await UserTag.createEntry(_, { user_id: user.id, tag_id })
            })
            //create user_category
            args.category_id.forEach(async category_id => {
                await UserCategory.createEntry(_, { user_id: user.id, category_id })
            })

            if (args.default_permission) {
                let permissions = JSON.parse(Buffer.from(args.menu_permission, 'base64').toString('ascii'));
                if (permissions && permissions.length > 0) {
                    let permissions_to_insert = [];
                    permissions.forEach(permission => {
                        permissions_to_insert.push({
                            user_id: args.id,
                            menu_id: permission.menu_id,
                            permission: permission.permission,
                            is_default: permission.is_default ? 1 : 0,
                            status: 1,
                            modified_date: new Date(),
                            modified_by: args.manager_id
                        })
                    });
                    await UserPermission.createEntries(_, permissions_to_insert);
                }
            }
            return user
        }
    },
    updateUser: {
        type,
        args: {
            id: { type: GraphQLInt },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
            user_name: { type: GraphQLString },
            manager_id: { type: GraphQLInt },
            category_id: { type: new GraphQLList(GraphQLInt) },
            tag_id: { type: new GraphQLList(GraphQLInt) },
            role_id: { type: new GraphQLList(GraphQLInt) },
            kn_office_id: { type: GraphQLInt },
            gender: { type: GraphQLInt },
            birthday: { type: GraphQLString },
            phone_number: { type: GraphQLString },
            f_image: { type: GraphQLString },
            avatar_upload: {
                description: 'Upload image.',
                type: GraphQLUpload
            },
            status: { type: GraphQLBoolean },
            default_permission: { type: GraphQLInt },
            menu_permission: { type: GraphQLString },
            soft_deleted: { type: GraphQLBoolean },
            modified_by: { type: GraphQLInt },
        },
        resolve: async (_, args, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            if (args.email) {
                const checkUser = await User.findOne(_, [], {'email': args.email})
                if (checkUser && checkUser.id != args.id) {
                    throw new Error('The email has not existed!')
                }
            }

            if (!args.f_image && args.avatar_upload) {
                const file = await storeUpload(args.avatar_upload, process.env.IMAGE_DIR)
                args.f_image = file.path
            }
            let data = {
                user_name: args.user_name,
                manager_id: args.manager_id,
                gender: args.gender,
                birthday: args.birthday,
                phone_number: args.phone_number,
                f_image: args.f_image,
                status: args.status,
                kn_office_id: args.kn_office_id,
                modified_by: args.modified_by,
                soft_deleted: args.soft_deleted
            }
            if (args.password) {
                data.password = await bcrypt.hash(args.password, 10)
            }
            const user = await User.updateEntry(_, { id: args.id, fields: data })

            //create user_role
            if (args.role_id) {
                await UserRole.executeQueryString2(`delete from user_role where role_id not in (?) and user_id = ?;`, [args.role_id, args.id])
                args.role_id.forEach(async role_id => {
                    await UserRole.executeQueryString2(`insert into user_role (user_id, role_id) values (?, ?) on duplicate key update user_id = user_id; `, [args.id, role_id])
                })
            }
            
            //create user_tag
            if (args.tag_id) {
                await UserTag.executeQueryString2(`delete from user_tag where tag_id not in (?) and user_id = ?;`, [args.tag_id, args.id])
                args.tag_id.forEach(async tag_id => {
                    await UserTag.executeQueryString2(`insert into user_tag (user_id, tag_id) values (?, ?) on duplicate key update user_id = user_id; `, [args.id, tag_id])
                })
            }
            
            //create user_category
            if (args.category_id) {
                await UserCategory.executeQueryString2(`delete from user_category where category_id not in (?) and user_id = ?;`, [args.category_id, args.id])
                args.category_id.forEach(async category_id => {
                    await UserCategory.executeQueryString2(`insert into user_category (user_id, category_id) values (?, ?) on duplicate key update user_id = user_id; `, [args.id, category_id])
                })
            }      
            
            if (args.default_permission && args.menu_permission) {
                let permissions = JSON.parse(Buffer.from(args.menu_permission, 'base64').toString('ascii'));
                let current_permissions = await UserPermission.executeQueryString(`select * from user_permission where user_id = ${args.id}`);
                if (permissions && permissions.length > 0) {
                    let permissions_to_update = [], permissions_to_insert = [];
                    permissions.forEach(permission => {
                        if (current_permissions && current_permissions.length > 0 && current_permissions.find(p => p.menu_id == permission.id)) {
                            permissions_to_update.push({
                                id: current_permissions.find(p => p.menu_id == permission.id).id,
                                permission: permission.permission,
                                is_default: permission.is_default ? 1 : 0,
                                status: 1,
                                modified_date: new Date(),
                                modified_by: args.modified_by
                            })
                        } else {
                            permissions_to_insert.push({
                                user_id: args.id,
                                menu_id: permission.id,
                                permission: permission.permission,
                                is_default: permission.is_default ? 1 : 0,
                                status: 1,
                                modified_date: new Date(),
                                modified_by: args.modified_by
                            })
                        }
                    });
                    await UserPermission.updateEntries(_, permissions_to_update, []);
                    await UserPermission.createEntries(_, permissions_to_insert);
                }
            } else {
                let permissions = await UserPermission.executeQueryString(`select * from user_permission where user_id = ${args.id}`);
                if (permissions && permissions.length > 0) {
                    let permissions_to_update = [];
                    permissions.forEach(permission => {
                        permissions_to_update.push({
                            id: permission.id,
                            status: 0,
                            modified_date: new Date(),
                            modified_by: args.modified_by
                        })
                    });
                    await UserPermission.updateEntries(_, permissions_to_update, []);
                }
            }

            return user
        }
    },
    removeUser: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLList(GraphQLInt) }
        },
        resolve: async (_, { id }, context) => {
            if (!context.user && !context.user.role_ids) {
                throw new Error('You are not authorized!')
            }

            const user = await User.findByFields({columns: [], fields: {id}})
            if (!user) {
                throw new Error('User not exists!')
            }
            
            id.forEach(async id => {
                await User.removeEntry(_, { id })
            });
            await UserRole.removeByField(_, { fields: {user_id: id} })
            await UserTag.removeByField(_, { fields: {user_id: id} })
            await UserCategory.removeByField(_, { fields: {user_id: id} })

            return true
        }
    },
    resetPassword: {
        type,
        args: {
            email: { type: GraphQLString }
        },
        resolve: async (_, { email }) => {
            const existed_user = await User.findOne(_, [], {'email': email})
            const newPass = shortid.generate();
            const user = await User.updateEntry(_, {
                id: existed_user.id,
                fields: {password: await bcrypt.hash(newPass, 10)}
            })

            var subject = '[FaceDetection] Reset Password'
            var html = `<p>Hi ${email}!</p><br/><p>Your password has changed to <b>${newPass}</b></p><br/><p>Best Regards,</p><br/><p>Admin.</p>`
            utils.sendMail(email, subject, html)

            return {'email': user.email}
        }
    },
    changePassword: {
        type,
        args: {
            old_password: { type: GraphQLString },
            new_password: { type: GraphQLString }
        },
        resolve: async (_, { old_password, new_password }, context) => {
            if (!context.user) {
                throw new Error('You are not authorized!')
            }

            if (!old_password || !new_password) {
                throw new Error('Please enter your old & new password')
            }

            let user = await User.findOne(_, [], {'id': context.user.user_id})
            if (!user) {
                throw new Error('No user with that email')
            }
            const valid = await bcrypt.compare(old_password, user.password)
            if (!valid) {
                throw new Error('Incorrect password')
            }

            const newPass = new_password;
            user = await User.updateEntry(_, {
                id: user.id,
                fields: {password: await bcrypt.hash(newPass, 10)}
            })
            
            return user
        }
    },
    login: {
        type,
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString }
        },
        resolve: async (_, { email, password }, context, info) => {
            const user = await User.findOne(_, [], {'email': email, 'status': 1, 'soft_deleted': 0})
            if (!user) {
                throw new Error('Không tìm thấy người dùng')
            }
            const valid = await bcrypt.compare(password, user.password)
            if (!valid) {
                throw new Error('Email hoặc mật khẩu không đúng')
            }
            const user_roles = await UserRole.executeQueryString(`select role_id from user_role where user_id = ${user.id}`)
            const roles = lodash.map(user_roles, 'role_id')
            if (roles.indexOf(UserRoleEnumType.USER) > 0) {
                throw new Error('You are not authorized!')
            }
            await UserRole.executeQueryString(`update users set last_login = CURRENT_TIME where id = ${user.id}`)
            // Return json web token
            user.access_token = jsonwebtoken.sign(
                { user_id: user.id, email: user.email, role_ids: roles, ip_address: context.ip },
                process.env.JWT_SECRET,
                { expiresIn: '90d' }
            )
            return user;
        }
    }
}
