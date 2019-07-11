const FacebookStrategy = require('passport-facebook').Strategy
    , {User} = require('../models')
    , R = require('ramda')
    , utils = require('../utils')
    , fbConfig = require('../../config/config.json').global.passport.facebook;

const strategy = new FacebookStrategy(
    R.merge(fbConfig, {profileFields: ['emails', 'name']}),
    async (accessToken, refreshToken, profile, done) => {
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value)
            return done(null, false, {message: 'missing required parameter email'});

        try{
            let email = profile.emails[0].value;

            let filter = {
                where: { email },
            };
            let user = await User.findOne(filter);

            if (!user) {
                let userData = {
                    email,
                    password: utils.randomString(10),
                    firstName: profile.name && profile.name.givenName || null,
                    lastName: profile.name && profile.name.familyName || null,
                    info: {}
                };
                user = await User.create(userData, {
                    include: [
                        {
                            association: User.associations.info,
                            as: 'info'
                        }
                    ]
                });
            }

            //transform user instance to plain object
            user = user.get({ plain: true });

            done(null, R.omit(['password', 'avatar', 'token'], user));
        } catch (e) {
            return done(e);
        }
    }
);

module.exports = strategy;