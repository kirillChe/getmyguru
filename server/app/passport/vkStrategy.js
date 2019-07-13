const vkStrategy = require('passport-vkontakte').Strategy
    , R = require('ramda')
    , vkConfig = require('../../config/config.json').passport.vk
    , { createUser } = require('./helpers');

const strategy = new vkStrategy(
    R.merge(vkConfig, {profileFields: ['emails', 'name']}),
    async (req, accessToken, refreshToken, params, profile, done) => {
        if (!params || !params.email)
            return done(null, false, {message: 'missing required parameter email'});

        let email = params.email;

        try{
            const user = await createUser({req, email, profile});

            done(null, R.omit(['password', 'avatar', 'token'], user));
        } catch (e) {
            return done(e);
        }
    }
);

module.exports = strategy;