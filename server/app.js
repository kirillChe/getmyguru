const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// for session
const uuid = require('uuid/v4');
const passport = require('passport');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require("redis");
const client = redis.createClient('redis://redis');

//Models
const models = require('./server/models');

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

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // @TODO Add missing properties for cookies (maxAge, ...)
    app.use(session({
        store: new redisStore({client, ttl: 26000}),
        secret: 'keyboard cat',
        genid: () => uuid(),
        resave: true,
        saveUninitialized: true,
        cookie: {
            // 2 hours
            maxAge: 2 * 60 * 60 * 1000
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

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
    require('./server/routes')(app);

    app.use(middleware.errorHandler());

    // server instance
    const server = http.createServer(app);

    // This creates our socket using the instance of the server
    const io = socketIO(server);

    // This is what the socket.io syntax is like, we will work this later
    io.on('connection', socket => {
        console.log('New client connected');

        // just like on the client side, we have a socket.on method that takes a callback function
        socket.on('NEW_MESSAGE', async (data) => {
            // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
            // we make use of the socket.emit method again with the argument given to use from the callback function above
            console.log('Message created: ', data);

            try {
                let message = await models.Message.create(data);
                io.sockets.emit(`${data.userId}_MESSAGE_SAVED`, message.userId);
                io.sockets.emit(`${data.receiver}_GOT_NEW_MESSAGE`, message.receiver);
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
