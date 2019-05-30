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
                language: 'en',
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
                language: 'en',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9721234567',
                age: 44,
                rating: 79,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                firstName: 'Irina',
                lastName: 'Ivanova',
                userType: 'guru',
                avatar: 3,
                gender: 'female',
                email: 'irka@yopmail.com',
                language: 'en',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9721234567',
                age: 32,
                rating: 84,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                firstName: 'Domald',
                lastName: 'Trump',
                userType: 'guru',
                avatar: 4,
                gender: 'male',
                email: 'donny@yopmail.com',
                language: 'en',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9721234567',
                age: 60,
                rating: 61,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                firstName: 'Bruce',
                lastName: 'Lee',
                userType: 'guru',
                avatar: null,
                gender: 'male',
                email: 'lee@yopmail.com',
                language: 'en',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                phone: '+9721234567',
                age: 29,
                rating: 90,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                firstName: 'Vasya',
                lastName: 'Bzdonskiy',
                userType: 'adept',
                avatar: null,
                gender: 'male',
                email: 'junior@yopmail.com',
                language: 'en',
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
