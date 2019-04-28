const authRoutes = require('./auth');
const usersRoutes = require('./users');
const messagesRoutes = require('./messages');
const commentsRoutes = require('./comments');
const ratingsRoutes = require('./ratings');
// const users = require('../controllers/usersController');


module.exports = app => {
    /** GET /api-status - Check service status **/
    app.get('/health-check', (req, res) => res.sendStatus(200));

    app.use('/auth', authRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api/messages', messagesRoutes);
    app.use('/api/comments', commentsRoutes);
    app.use('/api/ratings', ratingsRoutes);
};