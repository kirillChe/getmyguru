// eslint-disable-next-line no-unused-vars
const R = require('ramda');

const isAllowed = req =>
    (req.method === 'POST' && (R.startsWith('/auth/login', req.url) || R.startsWith('/api/users', req.url))) ||
    (req.method === 'GET' && R.startsWith('/api/users/filtersData', req.url)) ||
    R.startsWith('/api/users/getGurusPreviews', req.url) ||
    R.startsWith('/auth', req.url);

module.exports = () => (req, res, next) => {
    console.log('you hit the authentication endpoint\n');
    // req.session.foobar = Date.now();
    req.session.touch();

    if (isAllowed(req))
        return next();

    if (req.isAuthenticated()) {
        next();
    } else {
        console.log('User is not authenticated.');
        return res.sendStatus(401);
    }
};