const on = require('await-handler');
const Message = require('../models').Message;

const create = async (req, res, next) => {
    let [err, message] = await on(Message.create(req.body));
    if (err)
        return next(err);

    res.status(201).json(message);
};

const find = async (req, res, next) => {
    let filter = req.query.filter || {};

    let [err, data] = await on(Message.findAll(filter));
    if (err)
        return next(err);

    res.json(data);
};

const findById = async (req, res, next) => {
    let [err, message] = await on(Message.findByPk(req.params.id));
    if (err)
        return next(err);

    res.json(message);
};

const conversationsPartners = async (req, res, next) => {
    if (!req.query.ownerId)
        return res.sendStatus(400);

    let ctx = {
        ownerId: req.query.ownerId
    };
    let [err, data] = await on(Message.getPartners(ctx));
    if (err)
        return next(err);

    res.json(data);
};

const conversation = async (req, res, next) => {
    if (!req.query.ownerId || !req.query.partnerId)
        return res.sendStatus(400);

    let ctx = {
        ownerId: req.query.ownerId,
        partnerId: req.query.partnerId
    };
    let [err, data] = await on(Message.getConversation(ctx));
    if (err)
        return next(err);

    res.json(data);
};

module.exports = {
    create,
    find,
    findById,
    conversation,
    conversationsPartners
};
