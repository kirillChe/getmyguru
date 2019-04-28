const passport = require('passport');
const {User} = require('../models');
const LocalStrategy = require('./localStrategy');
const on = require('await-handler');


// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('*** serializeUser called ***');
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('*** DeserializeUser called ***');
    let [err, user] = await on(User.findByPk(id));
    if (err || !user)
        return done(err, false);

    done(null, user);
});

//  Use Strategies
passport.use(LocalStrategy);

module.exports = passport;