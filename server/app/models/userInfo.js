'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
        description: {
            type: DataTypes.STRING(3000)
        },
        competitiveExperience: {
            type: DataTypes.STRING(3000)
        },
        education: {
            type: DataTypes.STRING(3000)
        },
        experience: {
            type: DataTypes.ENUM,
            values: ['0-1', '2-4', '5+'],
            allowNull: false,
            defaultValue: '0-1'
        },
        nutritionScheme: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: false
        },
        trainingSystem: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: false
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        country: {
            type: DataTypes.STRING(2),
            validate: {
                isAlpha: true,
                len: [2,2]
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
