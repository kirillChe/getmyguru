const passport = require('passport')
    , {User, File} = require('../models')
    , LocalStrategy = require('./localStrategy')
    , RememberMeStrategy = require('./rememberMeStrategy')
    , FacebookStrategy = require('./facebookStrategy')
    , GoogleStrategy = require('./googleStrategy')
    , VkontakteStrategy = require('./vkStrategy')
    , R = require('ramda')
    , Op = require('sequelize').Op;


// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('*** serializeUser called ***');
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    console.log('*** DeserializeUser called ***');
    try {
        let filter = {
            where: {
                id: userId
            },
            include: [{
                model: File,
                as: 'files',
                where: {
                    id: {
                        [Op.col]: 'User.avatar'
                    }
                },
                required: false
            }]
        };

        let user = await User.findOne(filter);
        let avatarLocation = (user.files && user.files[0] && user.files[0].location) || null;
        //transform user instance to plain object
        user = user.get({ plain: true });
        let userData = R.merge(
            R.omit(['password', 'avatar', 'files', 'token'], user),
            { avatarLocation }
        );

        done(null, userData);

    } catch(e){
        done(e);
    }
});

//  Use Strategies


passport.use(LocalStrategy);
passport.use(RememberMeStrategy);
passport.use(FacebookStrategy);
passport.use(GoogleStrategy);
passport.use(VkontakteStrategy);

module.exports = passport;