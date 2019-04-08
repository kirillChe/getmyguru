'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Users', [{
            id: 1,
            firstName: 'John',
            lastName: 'Rambo',
            userType: 'admin',
            nickname: 'rambo',
            email: 'rambo@yopmail.com',
            password: 'qwerty12345',
            phone: '+9725551234',
            age: 36,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
