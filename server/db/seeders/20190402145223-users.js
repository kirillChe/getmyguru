'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Users', [{
            id: 3,
            firstName: 'Vasya',
            lastName: 'Bzdonskiy',
            userType: 'adept',
            gender: 'male',
            email: 'junior@yopmail.com',
            password: '$2y$12$ouhlGna5KSMaioCwSWmvOupENFD.ty896bhvwOztmjzLVSo9OcNce',
            phone: '+9727773254',
            age: 16,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
