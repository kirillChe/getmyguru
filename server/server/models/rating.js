'use strict';

const on = require('await-handler');
const R = require('ramda');

module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
        rated: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false
        },
        value: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            validate: {
                isNumeric: true,
                min: 1,
                max: 10
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
    Rating.associate = function ({User}) {
        Rating.belongsTo(User, {as: 'user'})
    };

    Rating.calculate = async function (ctx) {
        let filter = {
            where: {
                rated: ctx.userId
            }
        };

        let [err, data] = await on(Rating.findAll(filter));
        if (err)
            throw err;

        let getAverageValue = R.pipe(
            R.map(R.prop('value')),
            R.mean
        );
        return getAverageValue(data);
    };

    return Rating;
};
