'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UserLanguages', {
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
            code: {
                type: Sequelize.STRING(2)
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
            'UserLanguages',
            ['userId', 'code'],
            {
                indexName: 'uniqLang',
                unique: true
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('UserLanguages');
    }
};