'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Messages', [{
            id: 1,
            userId: 6,
            receiver: 2,
            showToReceiver: true,
            showToSender: false,
            text: 'Ti che derzish?',
            createdAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Messages', null, {})
};
