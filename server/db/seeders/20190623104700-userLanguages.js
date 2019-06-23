'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('UserLanguages', [
            {
                id: 1,
                userId: 1,
                code: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                userId: 1,
                code: 'ru',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                userId: 1,
                code: 'il',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                userId: 2,
                code: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                userId: 3,
                code: 'ru',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                userId: 3,
                code: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 7,
                userId: 4,
                code: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 8,
                userId: 5,
                code: 'ru',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 9,
                userId: 5,
                code: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 10,
                userId: 6,
                code: 'ru',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('UserLanguages', null, {})
};
