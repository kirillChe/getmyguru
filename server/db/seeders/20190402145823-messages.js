'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Messages', [
            {
                id: 1,
                userId: 6,
                receiver: 1,
                showToReceiver: true,
                showToSender: false,
                text: 'Ti che derzish?',
                createdAt: new Date()
            },
            {
                id: 2,
                userId: 1,
                receiver: 6,
                showToReceiver: true,
                showToSender: true,
                text: 'Do you know who do you speak with?',
                createdAt: new Date()
            },
            {
                id: 3,
                userId: 6,
                receiver: 1,
                showToReceiver: true,
                showToSender: true,
                text: 'It doesn\'t matter',
                createdAt: new Date()
            },
            {
                id: 4,
                userId: 1,
                receiver: 6,
                showToReceiver: true,
                showToSender: true,
                text: 'You should know',
                createdAt: new Date()
            },
            {
                id: 5,
                userId: 6,
                receiver: 1,
                showToReceiver: true,
                showToSender: true,
                text: 'Sorry...',
                createdAt: new Date()
            },
            {
                id: 6,
                userId: 3,
                receiver: 1,
                showToReceiver: true,
                showToSender: true,
                text: 'How r u?',
                createdAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Messages', null, {})
};
