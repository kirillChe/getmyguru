'use strict';

const R = require('ramda');

module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
        raterId: {
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
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'raterId']
            }
        ]
    });
    Rating.associate = function ({User}) {
        Rating.belongsTo(User, {as: 'user'})
    };

    Rating.afterCreate(async rating => {
        try {
            let userRating = await Rating.calculate(rating.userId);
            let { User } = sequelize.models;
            let user = await User.findByPk(rating.userId);
            user.update({rating: R.multiply(10, userRating)});

        } catch (e) {
            //@todo send to some logger
            console.log('Calculate user rating failed: ', e);
            //throw err;
        }
    });

    Rating.calculate = async userId => {
        let ratings = [];

        try{
            let filter = {
                where: {
                    userId
                },
                raw: true
            };

            ratings = await Rating.findAll(filter);
        } catch (e) {
            throw e;
        }

        let getAverageValue = R.pipe(
            R.map(R.prop('value')),
            R.mean
        );

        return getAverageValue(ratings);
    };

    return Rating;
};
