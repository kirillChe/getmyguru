'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('UserInfos', [
            {
                id: 1,
                userId: 1,
                description: null,
                phone: null,
                country: 'IL',
                site: null,
                languages: '["ru", "il", "en"]',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                userId: 2,
                description: 'The most famous trainer.',
                phone: '+972581234567',
                country: 'IL',
                site: null,
                languages: '["ru", "en"]',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                userId: 3,
                description: null,
                phone: '+79164320111',
                country: 'RU',
                site: null,
                languages: '["ru"]',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                userId: 4,
                description: 'Just a President of United States',
                phone: null,
                country: 'US',
                site: 'usa.gov',
                languages: '["en"]',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                userId: 5,
                description: 'I helped to Jackie Chan to become famous',
                phone: null,
                country: 'CH',
                site: null,
                languages: '["en"]',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                userId: 6,
                description: null,
                phone: null,
                country: 'RU',
                site: null,
                languages: '["ru"]',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('UserInfos', null, {})
};
