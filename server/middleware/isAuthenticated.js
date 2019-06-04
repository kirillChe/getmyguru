// eslint-disable-next-line no-unused-vars
const R = require('ramda');

module.exports = () => (req, res, next) => {
    console.log('isAuthenticated.js :3', req.url);
    console.log('isAuthenticated.js :4', req.session);

    //@todo remove 'true'
    //@todo add users/getGurusPreviews endpoint
    if (true ||
        (req.method === 'POST' && (R.startsWith('/auth/login', req.url) || R.startsWith('/api/users', req.url))) ||
        (req.method === 'GET' && R.startsWith('/api/public', req.url))
    ) {
        return next();
    }

    if (req.isAuthenticated()) {
        console.log('you hit the authentication endpoint\n');
        req.session.touch();
        next();
    } else {
        console.log('User is not authenticated.');
        res.sendStatus(401);
    }
};