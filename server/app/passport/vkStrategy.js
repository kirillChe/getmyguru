const vkStrategy = require('passport-vkontakte').Strategy
    , {User} = require('../models')
    , R = require('ramda')
    , utils = require('../utils')
    , vkConfig = require('../../config/config.json').global.passport.vk;

const strategy = new vkStrategy(
    R.merge(vkConfig, {profileFields: ['emails', 'name']}),
    async (req, accessToken, refreshToken, params, profile, done) => {
        console.log('----------->>>>');
        console.log(profile);
        console.log(params);
        console.log(req.params);
        console.log('----------->>>>');


        if (!params || !params.email)
            return done(null, false, {message: 'missing required parameter email'});

        try{
            let email = params.email;

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