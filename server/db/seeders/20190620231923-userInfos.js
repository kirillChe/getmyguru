'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('UserInfos', [
            {
                id: 1,
                userId: 1,
                description: null,
                competitiveExperience: null,
                education: null,
                experience: '11+',
                nutritionScheme: false,
                trainingSystem: false,
                phone: null,
                country: 'IL',
                site: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                userId: 2,
                description: 'The most famous trainer.',
                competitiveExperience: '1st place on the Mr. Olympia',
                education: null,
                experience: '11+',
                nutritionScheme: true,
                trainingSystem: true,
                phone: '+972581234567',
                country: 'IL',
                site: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                userId: 3,
                description: null,
                competitiveExperience: '3rd place on the Ms. Olympia',
                education: 'Alabama University',
                experience: '5-10',
                nutritionScheme: true,
                trainingSystem: true,
                phone: '+79164320111',
                country: 'RU',
                site: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                userId: 4,
                description: 'Just a President of United States',
                competitiveExperience: '1st place on the US presidential election',
                education: 'University of Pennsylvania',
                experience: '11+',
                nutritionScheme: false,
                trainingSystem: false,
                phone: null,
                country: 'US',
                site: 'usa.gov',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                userId: 5,
                description: 'I helped to Jackie Chan to become famous',
                competitiveExperience: null,
                education: null,
                experience: '2-4',
                nutritionScheme: false,
                trainingSystem: true,
                phone: null,
                country: 'CH',
                site: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                userId: 6,
                description: null,
                competitiveExperience: null,
                education: null,
                experience: '0-1',
                nutritionScheme: false,
                trainingSystem: false,
                phone: null,
                country: 'RU',
                site: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('UserInfos', null, {})
};
