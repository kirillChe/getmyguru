const authRoutes = require('./auth');
const usersRoutes = require('./users');
const filesRoutes = require('./files');
const messagesRoutes = require('./messages');
const commentsRoutes = require('./comments');
const ratingsRoutes = require('./ratings');


module.exports = app => {
    /** GET /api-status - Check service status **/
    app.get('/health-check', (req, res) => res.sendStatus(200));

    app.use('/auth', authRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api/files', filesRoutes);
    app.use('/api/messages', messagesRoutes);
    app.use('/api/comments', commentsRoutes);
    app.use('/api/ratings', ratingsRoutes);
};