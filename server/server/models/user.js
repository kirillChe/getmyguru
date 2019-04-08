'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        userType: {
            type: DataTypes.ENUM,
            values: ['admin', 'guru', 'adept'],
            allowNull: false,
            defaultValue: 'adept'
        },
        nickname: {
            type: DataTypes.STRING(30)
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        age: {
            type: DataTypes.INTEGER(2)
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {});
    User.associate = function (models) {
        User.hasMany(models.Message, {foreignKey: 'userId', as: 'messages'});
        User.hasMany(models.Comment, {foreignKey: 'userId', as: 'comments'});
        User.hasMany(models.Rating, {foreignKey: 'userId', as: 'ratings'});
    };
    return User;
};