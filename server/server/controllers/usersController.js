const on = require('await-handler');
const User = require('../models').User;

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


module.exports = {
    create,
    find,
    findById,
    update,
    destroy
};
