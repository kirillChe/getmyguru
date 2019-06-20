'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
        age: {
            type: DataTypes.INTEGER(2)
        },
        language: {
            type: DataTypes.STRING(2),
            allowNull: false,
            defaultValue: 'en'
        },
        description: {
            type: DataTypes.STRING(3000)
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        country: {
            type: DataTypes.STRING(2),
            validate: {
                isAlpha: true,
                len: [2,10]
            }
        },
        site: {
            type: DataTypes.STRING(300)
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
    }, {

    });
    UserInfo.associate = function ({User}) {
        UserInfo.belongsTo(User, {as: 'user'})
    };

    return UserInfo;
};
