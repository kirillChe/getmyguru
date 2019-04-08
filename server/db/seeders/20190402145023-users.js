'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Users', [{
            id: 2,
            firstName: 'John',
            lastName: 'Doe',
            userType: 'guru',
            nickname: 'trainer',
            email: 'trainer@yopmail.com',
            password: 'qwerty12345',
            phone: '+9721234567',
            age: 44,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
