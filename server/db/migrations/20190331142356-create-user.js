'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
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
            rating: {
                type: Sequelize.TINYINT
            },
            language: {
                allowNull: false,
                type: Sequelize.STRING(2),
                defaultValue: 'en'
            },
            birthDate: {
                type: Sequelize.DATE
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

        return queryInterface.addIndex(
            'Users',
            ['userType', 'email'],
            {
                indexName: 'uniqUser',
                unique: true
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Users');
    }
};