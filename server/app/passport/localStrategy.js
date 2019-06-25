const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models');
const R = require('ramda');

const strategy = new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (email, password, done) => {
        try{
            let filter = {
                where: { email }
            };
            let user = await User.findOne(filter);

            if (!user)
                return done(null, false, {message: 'Incorrect login'});

            if (!user.verifyPassword(password))
                return done(null, false, {message: 'Incorrect password'});
            
            //transform user instance to plain object
            user = user.get({ plain: true });

            done(null, R.omit(['password'], user));
        } catch (e) {
            return done(e);
        }
    }
);

module.exports = strategy;