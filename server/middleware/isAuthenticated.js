// eslint-disable-next-line no-unused-vars
module.exports = () => (req, res, next) => {
    console.log('isAuthenticated.js :3', req.url);
    console.log('isAuthenticated.js :4', req.session.cookie);
    if (true || req.method === 'POST' && (req.url === '/auth/login' || req.url === '/api/users'))
        return next();

    if (req.isAuthenticated()) {
        console.log('you hit the authentication endpoint\n');
        req.session.touch();
        next();
    } else {
        console.log('User is not authenticated.');
        res.sendStatus(401);
    }
};
