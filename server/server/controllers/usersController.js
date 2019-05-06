const on = require('await-handler');
const {User} = require('../models');

const create = async (req, res, next) => {
    let [err, user] = await on(User.create(req.body));
    if (err)
        return next(err);

    res.status(201).json(user);
};

const find = async (req, res, next) => {
    let filter = req.query.filter || {};

    let [err, data] = await on(User.findAll(filter));
    if (err)
        return next(err);

    res.json(data);
};

const findById = async (req, res, next) => {
    let [err, user] = await on(User.findByPk(req.params.id));
    if (err)
        return next(err);

    res.json(user);
};

const update = async (req, res, next) => {
    try {
        const model = await User.findByPk(req.params.id);
        if (!model)
            return res.sendStatus(404);

        //@todo check if it works
        model.update(req.body);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        await User.destroy({
            where: {id: req.params.id},
        });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    if (!req.query.email || !req.query.url)
        return res.status(400).json('Missing required parameters');

    try {
        let user = await User.findOne({ where: {email: req.query.email} });
        if (!user)
            return res.sendStatus(404);

        let info = await user.resetPassword(req.query.url);
        console.log('usersController.js :62', info);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const validateResetToken = async (req, res, next) => {
    if (!req.query.token)
        return res.status(400).json('Missing required parameters');

    try {
        let user = await User.validateResetToken(req.query.token);
        if (!user)
            return res.sendStatus(400);

        req.session.uid = user.id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

const setNewPassword = async (req, res, next) => {
    if (!req.session.uid || req.session.uid !== req.params.id)
        return res.status(400).json('Session is not valid');

    if (!req.body.newPassword || !req.params.id)
        return res.status(400).json('Missing required parameters');

    try {
        let user = await User.findByPk(req.params.id);
        if (!user)
            return res.sendStatus(404);

        await user.setNewPassword(req.body.newPassword);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    create,
    find,
    findById,
    update,
    destroy,
    resetPassword,
    validateResetToken,
    setNewPassword
};
