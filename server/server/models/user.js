'use strict';
const bcrypt = require('bcryptjs');

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
            type: DataTypes.STRING(100),
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

    User.associate = models => {
        User.hasMany(models.Message, {foreignKey: 'userId', as: 'messages'});
        User.hasMany(models.Comment, {foreignKey: 'userId', as: 'comments'});
        User.hasMany(models.Rating, {foreignKey: 'userId', as: 'ratings'});
    };

    User.beforeCreate(user => {
        user.password = bcrypt.hashSync(user.password, 10);
    });

    User.prototype.verifyPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
};