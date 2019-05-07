'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Files', [
            {
                id: 1,
                userId: 1,
                location: 'api/public/1557235374235-1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                userId: 2,
                location: 'api/public/1557235374237-2',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                userId: 3,
                location: 'api/public/1557235374238-3',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Files', null, {})
};
