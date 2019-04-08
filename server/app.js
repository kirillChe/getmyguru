const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
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

//Models
const models = require('./server/models');

models.sequelize.sync().then(() => {
    console.log('Nice! Database looks fine');

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
