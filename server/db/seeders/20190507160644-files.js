'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Files', [
            {
                id: 1,
                userId: 1,
                location: '/api/public/1-avatar',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                userId: 2,
                location: '/api/public/2-avatar',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                userId: 3,
                location: '/api/public/3-avatar',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                userId: 4,
                location: '/api/public/4-avatar',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                userId: 3,
                location: '/api/public/1557235374235-3',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                userId: 2,
                location: '/api/public/1557235374237-2',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 7,
                userId: 2,
                location: '/api/public/1557235374240-2',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 8,
                userId: 2,
                location: '/api/public/1557235374242-2',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Files', null, {})
};
