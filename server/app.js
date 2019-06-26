const express = require('express')
    , http = require('http')
    , socketIO = require('socket.io')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , cors = require('cors')
    , morgan = require('morgan');

// for session
const passport = require('passport')
    , session = require('express-session')
    , redisStore = require('connect-redis')(session)
    , redis = require("redis")
    , client = redis.createClient('redis://redis');

//Models
const models = require('./app/models');
//Middleware
const middleware = require(__dirname + '/middleware');
// set the port
const port = parseInt(process.env.PORT, 10) || 5000;
// Set up the express app
const app = express();


const serverApp = async () => {
    //TODO Don't leave it as is
    app.use(cors(/*{
        origin: 'http://192.168.68.123:3000',
        credentials: true
    }*/));

    //HTTP request logger
    app.use(morgan('dev'));

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(session({
        store: new redisStore({client, ttl: 26000}),
        secret: 'secretforsession',
        resave: true,
        saveUninitialized: true,
        cookie: {
            // 2 hours
            maxAge: 2 * 60 * 60 * 1000,
            originalMaxAge: 2 * 60 * 60 * 1000
            //for testing 1 min
            // maxAge: 60 * 1000,
            // originalMaxAge: 60 * 1000
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.authenticate('remember-me'));

    try {
        await models.sequelize.sync();
        console.log('Nice! Database looks fine');
    } catch (e) {
        console.log('Something went wrong with the Database update! ', e);
    }

    app.use(middleware.isAuthenticated());
    app.use(middleware.publicHandler());
    app.use(middleware.queryParser());

    //Require routes into the application
    require('./app/routes')(app);

    app.use(middleware.errorHandler());

    // server instance
    const server = http.createServer(app);

    // This creates our socket using the instance of the server
    const io = socketIO(server);

    // This is what the socket.io syntax is like, we will work this later
    io.on('connection', socket => {
        console.log('New client connected');

        // once a client has connected, we expect to get a ping from them saying what room they want to join
        socket.on('room', id => {
            socket.join(`room-${id}`);
        });

        socket.on('NEW_MESSAGE', async (data) => {
            console.log('Message created: ', data);

            try {
                let message = await models.Message.create(data);
                io.sockets.in(`room-${message.senderId}`).emit('MESSAGE_SAVED');
                io.sockets.in(`room-${message.receiverId}`).emit('GOT_NEW_MESSAGE');
            }catch (e) {
                console.log('app.js :91', e);
            }
        });

        // disconnect is fired when a client leaves the server
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    // start the app
    server.listen(port, () => console.log(`Server is running on port ${port}`));

    return server;
};


module.exports = serverApp();
