'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Ratings', [{
            id: 1,
            userId: 3,
            rated: 2,
            value: 1,
            createdAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Ratings', null, {})
};
