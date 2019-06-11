'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            ownerId: {
                allowNull: false,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            parentId: {
                allowNull: true,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            senderId: {
                allowNull: false,
                type: Sequelize.INTEGER(11).UNSIGNED,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            receiverId: {
                allowNull: false,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            text: {
                type: Sequelize.TEXT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Comments');
    }
};