const FacebookStrategy = require('passport-facebook').Strategy
    , R = require('ramda')
    , fbConfig = require('../../config/config.json').global.passport.facebook
    , { createUser } = require('./helpers');

const strategy = new FacebookStrategy(
    R.merge(fbConfig, {profileFields: ['emails', 'name']}),
    async (req, accessToken, refreshToken, profile, done) => {
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value)
            return done(null, false, {message: 'missing required parameter email'});

        let email = profile.emails[0].value;

        try{
            const user = await createUser({req, email, profile});

            done(null, R.omit(['password', 'avatar', 'token'], user));
        } catch (e) {
            return done(e);
        }
    }
);

module.exports = strategy;