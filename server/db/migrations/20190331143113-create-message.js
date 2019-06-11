'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
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
            showToReceiver: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            showToSender: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
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
        return queryInterface.dropTable('Messages');
    }
};