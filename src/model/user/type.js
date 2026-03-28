let {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')
const Role = require('../role/role')
const RoleType = require('../role/type')
const Tag = require('../tag/tag')
const TagType = require('../tag/type')
const Category = require('../category/category')
const CategoryType = require('../category/type')
const Menu = require('./menu')
const MenuType = require('./type_menu')
// Defines the type
module.exports = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        },
        user_name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        status: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        created_date: {
            type: new GraphQLNonNull(GraphQLString)
        },
        modified_date: {
            type: new GraphQLNonNull(GraphQLString)
        },
        manager_id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        user_vendor_id: {
            type: GraphQLInt
        },
        gender: {
            type: GraphQLInt
        },
        birthday: {
            type: GraphQLString
        },
        phone_number: {
            type: GraphQLString
        },
        f_image: {
            type: GraphQLString
        },
        access_token: {
            type: GraphQLString
        },
        user_role: {
            type: new GraphQLList(RoleType),
            resolve: async(obj) => {
                return await Role.executeQueryString(`select r.* from user_role ur join roles r on ur.role_id = r.id where ur.user_id = ${ obj.id }`)
            }
        },
        user_tag: {
            type: new GraphQLList(TagType),
            resolve: async(obj) => {
                return await Tag.executeQueryString(`select t.* from user_tag ut join tags t on ut.tag_id = t.id where ut.user_id = ${ obj.id }`)
            }
        },
        user_category: {
            type: new GraphQLList(CategoryType),
            resolve: async(obj) => {
                return await Category.executeQueryString(`select c.* from user_category uc join categories c on uc.category_id = c.id where uc.user_id = ${ obj.id }`)
            }
        },
        default_permission: {
            type: GraphQLInt,
            resolve: async(obj) => {
                let user_menu = await Menu.executeQueryString(`SELECT m.*, p.is_default, p.permission from menu m join user_permission p on p.menu_id = m.id WHERE p.permission in (1,2) and p.status = 1 and m.status = 1 and p.user_id = ${ obj.id }`);
                if (user_menu.length > 0) {
                    return 1; //custom
                }
                return 0; //default
            }
        },
        menu: {
            type: new GraphQLList(MenuType),
            resolve: async(obj) => {
                let user_menu = await Menu.executeQueryString(`SELECT m.*, p.is_default, p.permission from menu m join user_permission p on p.menu_id = m.id WHERE p.permission in (1,2) and p.status = 1 and m.status = 1 and p.user_id = ${ obj.id }`);
                if (user_menu.length > 0) {
                    return user_menu;
                }
                let user_role = await Role.executeQueryString(`select ur.* from user_role ur where ur.user_id = ${ obj.id }`);
                let user_role_id = user_role.length > 0 ? user_role[0].role_id : 0;
                if (user_role_id) {
                    if (user_role_id == 1) {
                        let menu = await Menu.executeQueryString(`SELECT m.* from menu m WHERE m.status = 1`);
                        menu.forEach(m => m.permission = 2);
                        return menu;
                    } else {
                        return await Menu.executeQueryString(`SELECT m.*, p.is_default, p.permission from menu m join role_permission p on p.menu_id = m.id join user_role r on r.role_id = p.role_id WHERE p.permission in (1,2) and p.status = 1 and m.status = 1 and r.user_id = ${ obj.id }`);
                    }
                }
                return [];
            }
        },
        soft_deleted: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        kn_office_id: {
            type: GraphQLInt
        },
        modified_by: {
            type: GraphQLInt
        }
    }
})