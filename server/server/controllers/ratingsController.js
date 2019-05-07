const on = require('await-handler');
const Rating = require('../models').Rating;

const create = async (req, res, next) => {
    let [err, rating] = await on(Rating.create(req.body));
    if (err)
        return next(err);

    res.status(201).json(rating);
};

const find = async (req, res, next) => {
    let filter = req.query.filter || {};

    let [err, data] = await on(Rating.findAll(filter));
    if (err)
        return next(err);

    res.json(data);
};

const findById = async (req, res, next) => {
    let [err, rating] = await on(Rating.findByPk(req.params.id));
    if (err)
        return next(err);

    res.json(rating);
};

const calculate = async (req, res, next) => {
    if (!req.query.userId)
        return res.sendStatus(400);

    let [err, rating] = await on(Rating.calculate(req.query.userId));
    if (err)
        return next(err);

    res.json(rating);
};

module.exports = {
    create,
    find,
    findById,
    calculate
};
