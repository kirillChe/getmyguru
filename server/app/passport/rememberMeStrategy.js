const RememberMeStrategy = require('passport-remember-me').Strategy
    , {User, File} = require('../models')
    , utils = require('../utils')
    , R = require('ramda')
    , Op = require('sequelize').Op;

const strategy = new RememberMeStrategy(
    async (token, done) => {
        try {
            let filter = {
                where: {
                    token
                },
                include: [{
                    model: File,
                    as: 'files',
                    where: {
                        id: {
                            [Op.col]: 'User.avatar'
                        }
                    },
                    required: false
                }]
            };
            let user = await User.findOne(filter);
            if (!user)
                return done(null, false);

            let avatarLocation = (user.files && user.files[0] && user.files[0].location) || null;
            //transform user instance to plain object
            user = user.get({ plain: true });
            let userData = R.merge(
                R.omit(['password', 'avatar', 'files', 'token'], user),
                { avatarLocation }
            );

            console.log('_________________', userData);
            done(null, R.omit(['password', 'avatar', 'token'], userData));
        }catch (e) {
            done(e);
        }
    },
    async (user, done) => {
        console.log('****************', user);
        var token = utils.randomString(64);
        try {
            await User.update({token}, {where: {id: user.id}});
            done(null, token);
        }catch (e) {
            done(e);
        }
    }
);

module.exports = strategy;