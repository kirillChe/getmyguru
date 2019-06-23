'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserLanguage = sequelize.define('UserLanguage', {
        code: {
            type: DataTypes.STRING(2),
            validate: {
                isAlpha: true,
                len: [2,2]
            }
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
        indexes: [
            {
                unique: true,
                fields: ['code', 'userId']
            }
        ]
    });
    UserLanguage.associate = function ({User}) {
        UserLanguage.belongsTo(User, {as: 'user'})
    };

    return UserLanguage;
};
