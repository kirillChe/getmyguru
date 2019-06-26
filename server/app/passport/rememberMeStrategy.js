const RememberMeStrategy = require('passport-remember-me').Strategy
    , {User} = require('../models')
    , utils = require('../utils');

const strategy = new RememberMeStrategy(
    async (token, done) => {
        try {
            let filter = {
                where: {
                    token
                },
                raw: false
            };
            let user = await User.findOne(filter);
            if (!user)
                return done(null, false);
            done(null, user);
        }catch (e) {
            done(e);
        }
    },
    async (user, done) => {
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