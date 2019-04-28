const express = require('express');
const router = express.Router();
const passport = require('../passport');


/** GET /auth/isLoggedIn - Checks is user logged in */
router.route('/isLoggedIn').get((req, res) => {
    console.log('===== user!!======');
    console.log(req.user);

    if (req.user) {
        res.json({user: req.user})
    } else {
        res.json({user: null})
    }
});

/** POST /auth/login - Login to App */
router.route('/login').post((req, res, next) => {
    console.log('auth.js :9', req.body);
    passport.authenticate('local', (err, user, info) => {
        console.log('_________________HERE: 107________________________', err, info);
        if (!user && info)
            return res.status(401).send(info.message);

        if (err)
            return next(err);

        if (!user)
            return res.sendStatus(401);

        req.login(user, (err) => {
            if (err)
                return next(err);

            console.log('app.js :120', req.session);

            return res.redirect('/api/users');
        })
    })(req, res, next);
});

/** POST /auth/logout - Logout from the App */
router.route('/logout').post((req, res) => {
    if (req.user) {
        req.logout();
        req.session.destroy();
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
});

module.exports = router;