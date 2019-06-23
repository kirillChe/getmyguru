'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('UserInfos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER(11).UNSIGNED,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            description: {
                type: Sequelize.STRING(3000)
            },
            competitiveExperience: {
                type: Sequelize.STRING(3000)
            },
            education: {
                type: Sequelize.STRING(3000)
            },
            experience: {
                type: Sequelize.ENUM,
                values: ['0-1', '2-4', '5-10', '11+'],
                allowNull: false,
                defaultValue: '0-1'
            },
            nutritionScheme: {
                type: Sequelize.TINYINT(1),
                allowNull: false,
                defaultValue: false
            },
            trainingSystem: {
                type: Sequelize.TINYINT(1),
                allowNull: false,
                defaultValue: false
            },
            phone: {
                type: Sequelize.STRING(20)
            },
            country: {
                type: Sequelize.STRING(2)
            },
            site: {
                type: Sequelize.STRING(300)
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
        return queryInterface.dropTable('UserInfos');
    }
};