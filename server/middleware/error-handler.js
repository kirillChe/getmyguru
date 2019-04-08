// eslint-disable-next-line no-unused-vars
module.exports = () => (err, req, res, next) => {
    console.log('-----------------------------');
    console.dir(err, {colors: true, depth: 5});
    console.log('-----------------------------');

    // if (err && err.name === 'ValidationError') {
    //     err.status = 422;
    //     err.message = err._message;
    //     err.details = R.map(R.pickAll(['message', 'path', 'value']), err.errors);
    // } else {
    //     err.status = 500;
    //     err.message = 'Something went wrong';
    // }
    //
    // return res.status(err.status)
    //     .json({
    //         status: err.status,
    //         message: err.message,
    //         details: err.details
    //     });



    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
};
