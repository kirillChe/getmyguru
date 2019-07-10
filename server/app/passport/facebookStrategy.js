const FacebookStrategy = require('passport-facebook').Strategy
    , {User} = require('../models')
    , R = require('ramda');

const strategy = new FacebookStrategy(
    {
        clientID: '2069194676524263',
        clientSecret: '6c550d60f076ed929eb4799c0adb1003',
        callbackURL: 'http://192.168.68.123:3100/auth/facebook/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('___________________');
        console.log('___FACEBOOK______');
        console.log(profile);
        console.log('___________________');
        console.log('___________________');
        done(null, false, {message: 'Incorrect login'});
        // try{
        //     let filter = {
        //         where: { email },
        //     };
        //     let user = await User.findOne(filter);
        //
        //     if (!user)
        //         return done(null, false, {message: 'Incorrect login'});
        //
        //     if (!user.verifyPassword(password))
        //         return done(null, false, {message: 'Incorrect password'});
        //
        //     //transform user instance to plain object
        //     user = user.get({ plain: true });
        //
        //     done(null, R.omit(['password', 'avatar', 'token'], user));
        // } catch (e) {
        //     return done(e);
        // }
    }
);

module.exports = strategy;