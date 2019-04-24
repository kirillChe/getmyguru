const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');

// for session
const uuid = require('uuid/v4');
const passport = require('passport');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require("redis");
const client = redis.createClient('redis://redis');

//Models
const models = require('./server/models');

// load middlewares
const middleware = require('require-all')({
    dirname: __dirname + '/middleware',
    map: _.camelCase
});

// Set up the express app
const app = express();


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
    store: new redisStore({client, ttl: 260}),
    secret: 'keyboard cat',
    genid: () => uuid(),
    resave: false,
    saveUninitialized: true,
    cookie: {
        // 2 minutes for testing
        maxAge: 2 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());


models.sequelize.sync().then(() => {
    console.log('Nice! Database looks fine');

    app.use(middleware.isAuthenticated());
    app.use(middleware.sequelizeQueryParser());

    //Require routes into the application
    require('./server/routes')(app);

    app.use(middleware.errorHandler());

    // set the port
    const port = parseInt(process.env.PORT, 10) || 5000;
    // start the app
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`); // eslint-disable-line no-console
        // emit started event
        app.emit('started');
        app.started = true;
    });

}).catch(err => {
    console.log('Something went wrong with the Database update! ', err);
});

module.exports = app;
