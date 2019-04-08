'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Comments', [{
            id: 2,
            userId: 2,
            parentId: 1,
            receiver: 1,
            text: 'Too much for you!',
            createdAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
