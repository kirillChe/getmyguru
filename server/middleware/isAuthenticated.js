// eslint-disable-next-line no-unused-vars
module.exports = () => (req, res, next) => {
    console.log('isAuthenticated.js :3', req.url);
    if (req.method === 'POST' && req.url === '/auth/login')
        return next();

    if (req.isAuthenticated()) {
        console.log('you hit the authentication endpoint\n');
        next();
    } else {
        console.log('User is not authenticated.');
        res.sendStatus(401);
    }
};
