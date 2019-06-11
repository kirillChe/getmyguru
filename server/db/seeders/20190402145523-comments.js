'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Comments', [
            {
                id: 1,
                ownerId: 2,
                parentId: null,
                senderId: 6,
                receiverId: 2,
                text: 'How much your program costs?',
                createdAt: new Date()
            },
            {
                id: 2,
                ownerId: 2,
                parentId: 1,
                senderId: 2,
                receiverId: 6,
                text: 'Too much for you!',
                createdAt: new Date()
            }
        ], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
