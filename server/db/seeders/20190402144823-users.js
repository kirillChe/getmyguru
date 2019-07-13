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
                rating: 100,
                language: 'en',
                birthDate: new Date('1983-01-14'),
                token: null,
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
                rating: 79,
                language: 'en',
                birthDate: new Date('1975-03-11'),
                token: null,
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
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                rating: 84,
                language: 'en',
                birthDate: new Date('1987-11-12'),
                token: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                firstName: 'Donald',
                lastName: 'Trump',
                userType: 'guru',
                avatar: 4,
                gender: 'male',
                email: 'donny@yopmail.com',
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                rating: 61,
                language: 'en',
                birthDate: new Date('1959-08-02'),
                token: null,
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
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                rating: 90,
                language: 'en',
                birthDate: new Date('1990-10-14'),
                token: null,
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
                password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
                rating: 32,
                language: 'en',
                birthDate: new Date('2003-12-12'),
                token: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
