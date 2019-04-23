const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models');
const on = require('await-handler');


passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    async (email, password, done) => {
        let [err, user] = await on(User.findOne({ where: {email: email} }));
        console.log('local.js :13', err, user);
        if (err)
            return done(err);

        if (!user)
            return done(null, false);

        // if (!user.verifyPassword(password)) { return done(null, false); }
        console.log('app.js :35', bcrypt.compareSync(password, user.password));
        if (!bcrypt.compareSync(password, user.password))
            return done(null, false);

        done(null, user);
    }
));


// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let [err, user] = await on(User.findByPk(id));
    if (err || !user)
        return done(err, false);

    done(null, user);
});

module.exports = passport;