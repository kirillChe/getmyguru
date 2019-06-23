const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models');
const on = require('await-handler');

const strategy = new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (email, password, done) => {
        let [err, user] = await on(User.findOne({ where: {email: email} }));
        if (err)
            return done(err);

        if (!user)
            return done(null, false, {message: 'Incorrect login'});

        if (!user.verifyPassword(password))
            return done(null, false, {message: 'Incorrect password'});

        done(null, user);
    }
);

module.exports = strategy;