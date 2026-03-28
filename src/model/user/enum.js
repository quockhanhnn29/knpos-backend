let {
    GraphQLEnumType,
} = require('graphql');

const userRoleEnumType = new GraphQLEnumType({
    name: 'UserRoleTypeEnum',
    values: {
        SUPER_ADMIN: {
            value: 1,           
            description: 'SUPER ADMIN',
        },
        ADMIN: {
            value: 2,
            description: 'ADMIN'
        },
        USER: {
            value: 3,
            description: 'USER'
        },
        MANAGER: {
            value: 4,
            description: 'MANAGER'
        }
    },
});

module.exports = {
    UserRoleEnumType: userRoleEnumType,
};