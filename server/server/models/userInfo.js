'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
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
        languages: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('value'));
            },
            set: function (value) {
                this.setDataValue('value', JSON.stringify(value));
            },
            allowNull: false
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
