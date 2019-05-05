const on = require('await-handler');
const {File} = require('../models');


const upload = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let ctx = {
        req, res, userId: req.params.userId
    };
    File.upload(ctx, next);
};

const findById = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let [err, file] = await on(File.findByPk(req.params.id));
    if (err)
        return next(err);

    res.status(200).json(file);
};

const find = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let filter = req.query.filter || {};

    if (filter.where) {
        filter.where.userId = req.params.userId;
    } else {
        filter.where = {
            userId: req.params.userId
        };
    }

    let [err, data] = await on(File.findAll(filter));
    if (err)
        return next(err);

    res.status(200).json(data);
};

const destroy = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let [err, file] = await on(File.findByPk(req.params.id));
    if (err)
        return next(err);

    if (!file)
        return res.sendStatus(404);

    try {
        await file.destroy();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};



module.exports = {
    upload,
    find,
    findById,
    destroy
};
