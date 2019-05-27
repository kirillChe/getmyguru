const passport = require('passport');
const {File} = require('../models');
const R = require('ramda');
const LocalStrategy = require('./localStrategy');
const on = require('await-handler');


// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('*** serializeUser called ***');
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    console.log('*** DeserializeUser called ***', user);
    // let [err, user] = await on(User.findByPk(id));
    // if (err || !user)
    //     return done(err, false);

    [err, file] = await on(File.findByPk(user.avatar));
    if (err) {
        //@todo send to kibana
        console.log(`cannot find user avatar by provided id: ${user.avatar}, err: ${err}`);
    }
    user.avatarLocation = file && file.location || null;

    done(null, R.omit(['password'], user));
});

//  Use Strategies
passport.use(LocalStrategy);

module.exports = passport;