const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , R = require('ramda')
    , googleConfig = require('../../config/config.json').passport.google
    , { createUser } = require('./helpers');

const strategy = new GoogleStrategy(
    googleConfig,
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