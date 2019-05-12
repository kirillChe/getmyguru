const on = require('await-handler');
const {User, File} = require('../models');
const R = require('ramda');
const async = require('async');

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
    if (!req.body.email)
        return res.status(400).json('Missing required parameters');

    try {
        //@todo move host/port to config
        let url = `http://${req.host}:3100/reset_password`;

        let ctx = {
            url,
            email: req.body.email
        };

        let info = await User.resetPassword(ctx);

        res.sendStatus(204);
    } catch (error) {
        //@todo add error handler
        next(error);
    }
};

const setNewPassword = async (req, res, next) => {
    let ctx = {
        token: req.body.token,
        newPassword: req.body.newPassword
    };

    if (!ctx.newPassword || !ctx.token)
        return res.status(400).json('Missing required parameters');

    try {
        await User.setNewPassword(ctx);
        res.sendStatus(204);
    } catch (error) {
        //@todo add error handler
        next(error);
    }
};

const mostPopular = async (req, res, next) => {
    let filter = {
        where: {
            userType: 'guru'
        },
        attributes: ['firstName', 'lastName', 'avatar', 'rating', 'gender'],
        order: [
            ['rating', 'DESC']
        ],
        limit: req.query.limit || 4
    };

    //@todo refactor
    try {
        let users = await User.findAll(filter);
        users = R.map(user => {
            user.rating = R.divide(user.rating, 10);
            return user;
        }, users);

        await Promise.all(users.map(async user => {
            if (!user.avatar) {
                user.setDataValue('avatarLocation', null);
            } else {
                let file = await File.findByPk(user.avatar);
                user.setDataValue('avatarLocation', file.location);
            }
        }));

        /**
         * Add rating / 10
         * avatar location
         * description
         */
        res.json(users);
    }catch (e) {
        console.log('usersController.js :114', e);
        next(e);
    }
};


module.exports = {
    create,
    find,
    findById,
    update,
    destroy,
    resetPassword,
    setNewPassword,
    mostPopular
};
