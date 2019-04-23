const passportLocal = require('../auth/local');
const usersRoutes = require('./users');
const messagesRoutes = require('./messages');
const commentsRoutes = require('./comments');
const ratingsRoutes = require('./ratings');
// const users = require('../controllers/usersController');

module.exports = app => {
    /** GET /api-status - Check service status **/
    app.get('/health-check', (req, res) => res.sendStatus(200));

    // POST /auth
    app.post('/oauth/', (req, res, next) => {
        console.log('index.js :14', req.body);
        passportLocal.authenticate('local', (err, user, info) => {
            console.log('_________________HERE: 107________________________', err, user, info);
            if(info)
                return res.send(info.message);

            if (err)
                return next(err);

            if (!user)
                return res.sendStatus(401);

            req.login(user, (err) => {
                if (err)
                    return next(err);

                console.log('app.js :120', req.session);

                return res.redirect('/');
            })
        })(req, res, next);
    });

    // app.get('/api/users', users.find);
    app.use('/api/users', usersRoutes);
    app.use('/api/messages', messagesRoutes);
    app.use('/api/comments', commentsRoutes);
    app.use('/api/ratings', ratingsRoutes);
};