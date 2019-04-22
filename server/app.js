const express = require('express');
const bodyParser = require('body-parser');

const uuid = require('uuid/v4');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const redis   = require("redis");
const client = redis.createClient('redis://redis');
const bcrypt = require('bcrypt');
// const {User} = require('./server/models');
//Models
const models = require('./server/models');
const on = require('await-handler');
// //'redis://redis'


const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
// load middlewares
const middleware = require('require-all')({
    dirname: __dirname + '/middleware',
    map: _.camelCase
});

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        console.log('_________________HERE: 29________________________', email, password);
        try {
            const user = await models.User.findOne({ where: {email: email} });
            if (!user)
                return done(null, false);
            console.log('app.js :35', password, user.password);
            console.log('app.js :35', bcrypt.compareSync(password, user.password));
            // if (!user.verifyPassword(password)) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false);

            return done(null, user);
        } catch (error) {
            console.log('app.js :43', error);
            done(error);
        }
    }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    models.User.findByPk(user.id)
        .then(user => done(null, user) )
        .catch(error => done(error, false))
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

app.use(session({
    genid: (req) => {
        return uuid() // use UUIDs for session IDs
    },
    store: new redisStore({ host: 'redis', port: 6379, client: client,ttl :  260}),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



models.sequelize.sync().then(() => {
    console.log('Nice! Database looks fine');

    app.use(middleware.sequelizeQueryParser());

    //Require routes into the application
    require('./server/routes')(app);

    app.use(middleware.errorHandler());



    app.post('/api/login', (req, res, next) => {
        console.log('_________________HERE: 91________________________', req.body);
        passport.authenticate('local', (err, user, info) => {
            // console.log('_________________HERE: 107________________________', err, user, info);
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

                return res.redirect('/authrequired');
            })
        })(req, res, next);
    });

    app.get('/api/authrequired', (req, res) => {
        if(req.isAuthenticated()) {
            res.send('you hit the authentication endpoint\n')
        } else {
            res.redirect('/')
        }
    });




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
