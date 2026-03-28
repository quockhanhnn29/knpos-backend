let {
    GraphQLEnumType,
} = require('graphql');

const UserRoleEnumType = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    USER: 3,
    GUEST_MANAGER: 4
};

module.exports = {
    UserRoleEnumType,
};