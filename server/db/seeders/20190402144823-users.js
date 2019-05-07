'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Users', [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Rambo',
                userType: 'admin',
                avatar: 1,
                gender: 'male',
                email: 'rambo@yopmail.com',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9725551234',
                age: 36,
                rating: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                firstName: 'John',
                lastName: 'Doe',
                userType: 'guru',
                avatar: 2,
                gender: 'male',
                email: 'trainer@yopmail.com',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9721234567',
                age: 44,
                rating: 79,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                firstName: 'Vasya',
                lastName: 'Bzdonskiy',
                userType: 'adept',
                avatar: 3,
                gender: 'male',
                email: 'junior@yopmail.com',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9727773254',
                age: 16,
                rating: 32,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
