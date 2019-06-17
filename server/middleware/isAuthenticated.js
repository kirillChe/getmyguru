// eslint-disable-next-line no-unused-vars
const R = require('ramda');

const isAllowed = req =>
    (req.method === 'POST' && (R.startsWith('/auth/login', req.url) || R.startsWith('/api/users', req.url))) ||
    (req.method === 'GET' && R.startsWith('/api/public', req.url)) ||
    R.startsWith('/api/users/getGurusPreviews', req.url) ||
    R.startsWith('/auth/isLoggedIn', req.url);

module.exports = () => (req, res, next) => {

    if (isAllowed(req))
        return next();
    // return res.sendStatus(401);
    return res.status(404).json({messages: "Idi nahuy"});
    // console.log('isAuthenticated.js :3', req.url);
    // console.log('isAuthenticated.js :4', req.session);

    // //@todo remove 'true'
    // //@todo add users/getGurusPreviews endpoint
    // //@todo add auth/isLoggedIn endpoint
    // if (true ||
    //     (req.method === 'POST' && (R.startsWith('/auth/login', req.url) || R.startsWith('/api/users', req.url))) ||
    //     (req.method === 'GET' && R.startsWith('/api/public', req.url))
    // ) {
    //     return next();
    // }

    if (req.isAuthenticated()) {
        console.log('you hit the authentication endpoint\n');
        req.session.touch();
        next();
    } else {
        console.log('User is not authenticated.');
        return res.sendStatus(401);
    }
};