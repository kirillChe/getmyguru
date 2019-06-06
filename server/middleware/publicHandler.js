const R = require('ramda');
const path = require('path');

module.exports = () => (req, res, next) => {

    if (req.method === 'GET' && R.startsWith('/api/public', req.url)) {
        // console.log('_________________public handler________________________');
        let filePath = `..${R.replace('/api', '', req.url)}`;
        return res.sendFile(path.join(__dirname, filePath));
    }
    next();
};
