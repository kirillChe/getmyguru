'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            firstName: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            lastName: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            userType: {
                allowNull: false,
                type: Sequelize.ENUM('admin', 'guru', 'adept'),
                defaultValue: 'adept'
            },
            avatar: {
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            gender: {
                type: Sequelize.ENUM('male', 'female')
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING(40),
                unique: true
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            phone: {
                type: Sequelize.STRING(20)
            },
            age: {
                type: Sequelize.INTEGER(2)
            },
            rating: {
                type: Sequelize.TINYINT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Users');
    }
};