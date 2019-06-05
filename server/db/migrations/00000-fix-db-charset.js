'use strict';

//sequelize known bug https://github.com/sequelize/cli/issues/590
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `ALTER DATABASE ${queryInterface.sequelize.config.database}
        CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
        )
    },
    down: (queryInterface, Sequelize) => { }
};