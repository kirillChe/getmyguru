const express = require('express')
    , utils = require('../utils')
    , router = express.Router()
    , passport = require('../passport')
    , {User} = require('../models');


/** GET /auth/isLoggedIn - Checks is user logged in */
router.get(
    '/isLoggedIn',
    (req, res) => {
        if (req.user)
            return res.json(req.user);

        // res.json({user: null});
        res.sendStatus(401);
    }
);

/** POST /auth/login - Login to App */
router.post(
    '/login',
    passport.authenticate('local'),
    (req, res, next) => {
        console.log('logged in', req.user && req.user.id);
        console.log('logged in', req.user);
        req.login(req.user, async err => {
            if (err)
                return next(err);

            if (!req.body.remember)
                return res.sendStatus(200);

            let token = utils.randomString(64);
            try {
                await User.update({token}, {where: {id: req.user.id}});
                res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
                res.sendStatus(200);
            }catch (e) {
                next(e);
            }
        })
    }
);

/* FACEBOOK ROUTER */
/** GET /auth/facebook - Login to App throw Facebook account */
router.get('/facebook', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('_________________Successful authentication________________________');
        res.redirect('/');
    });

/* GOOGLE ROUTER */
/** GET /auth/google - Login to App throw Google account */
router.get('/google',
    passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email' }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

/** POST /auth/logout - Logout from the App */
router.post(
    '/logout',
    async (req, res) => {
        if (req.user) {
            try {
                await User.update({token: null}, {where: {id: req.user.id}});
            }catch (e) {
                console.log('WARN: User logout: failed to clear token: ', e);
            }
            res.clearCookie('remember_me');
            req.logout();
            req.session.destroy();
            res.send({msg: 'logging out'})
        } else {
            res.send({msg: 'no user to log out'})
        }
    }
);

module.exports = router;