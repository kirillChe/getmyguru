'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Ratings', {
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
            raterId: {
                allowNull: false,
                type: Sequelize.INTEGER(11).UNSIGNED
            },
            value: {
                allowNull: false,
                type: Sequelize.INTEGER(2)
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
        return queryInterface.addIndex(
            'Ratings',
            ['userId', 'raterId'],
            {
                indexName: 'uniqRater',
                unique: true
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Ratings');
    }
};