'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Comments', [{
            id: 1,
            userId: 3,
            parentId: null,
            receiver: 2,
            text: 'How much your program costs?',
            createdAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
