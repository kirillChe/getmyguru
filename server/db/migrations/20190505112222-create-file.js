'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Files', {
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
            location: {
                allowNull: false,
                type: Sequelize.STRING(60)
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
        return queryInterface.dropTable('Files');
    }
};