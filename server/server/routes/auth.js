const express = require('express');
const router = express.Router();
const passport = require('../passport');


/** GET /auth/isLoggedIn - Checks is user logged in */
router.get(
    '/isLoggedIn',
    (req, res) => {
        console.log('===== user!!======');
        console.log(req.user);

        if (req.user) {
            res.json({user: req.user})
        } else {
            res.json({user: null})
        }
    }
);

/** POST /auth/login - Login to App */
router.post(
    '/login',
    (req, res, next) => {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body);
        next();
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            email: req.user.email
        };
        res.send(userInfo);
    }
);

// router.route('/login').post((req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (!user && info)
//             return res.status(401).send(info.message);
//
//         if (err)
//             return next(err);
//
//         if (!user)
//             return res.sendStatus(401);
//
//         req.login(user, (err) => {
//             if (err)
//                 return next(err);
//
//             next();
//
//             // return res.redirect('/api/users');
//         })
//     })(req, res, next);
// });

/** POST /auth/logout - Logout from the App */
router.post(
    '/logout',
    (req, res) => {
        if (req.user) {
            req.logout();
            req.session.destroy();
            res.send({msg: 'logging out'})
        } else {
            res.send({msg: 'no user to log out'})
        }
    }
);

module.exports = router;