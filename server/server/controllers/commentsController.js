const on = require('await-handler');
const Comment = require('../models').Comment;

const create = async (req, res, next) => {
    let [err, comment] = await on(Comment.create(req.body));
    if (err)
        return next(err);

    res.status(201).json(comment);
};

const find = async (req, res, next) => {
    let filter = req.query.filter || {};

    let [err, data] = await on(Comment.findAll(filter));
    if (err)
        return next(err);

    res.json(data);
};

const findById = async (req, res, next) => {
    let [err, comment] = await on(Comment.findByPk(req.params.id));
    if (err)
        return next(err);

    res.json(comment);
};

const update = async (req, res, next) => {
    try {
        const model = await Comment.findByPk(req.params.id);
        if (!model)
            return res.sendStatus(404);
        model.update(req.body);
        res.json(model);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    find,
    findById,
    update
};
