'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('Ratings', [{
            id: 1,
            userId: 2,
            rated: 6,
            value: 1,
            createdAt: new Date()
        }], {});
    },

    down: queryInterface => queryInterface.bulkDelete('Ratings', null, {})
};
