const on = require('await-handler');
const Op = require('sequelize').Op;
const R = require('ramda');

const {Message, User} = require('../models');

const create = async (req, res, next) => {
    let userId = req.session.passport && req.session.passport.user && req.session.passport.user.id;
    if (!userId)
        return res.sendStatus(400);

    req.body.userId = userId;

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
    let ownerId = req.session.passport && req.session.passport.user && req.session.passport.user.id;
    if (!ownerId)
        return res.sendStatus(400);

    let filter = {
        where: {
            [Op.or]: [
                {
                    userId: ownerId,
                    showToSender: true
                },
                {
                    receiver: ownerId,
                    showToReceiver: true
                }
            ]
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: User, as: 'user', include: ['files']
        }]
    };

    let [err, data] = await on(Message.findAll(filter));
    if (err)
        return next(err);

    if (!data)
        res.json([]);

    let partnersIds = R.pipe(
        R.map(R.props(['userId', 'receiver'])),
        R.flatten,
        R.uniq,
        R.reject(R.equals(Number(ownerId)))
    )(data);

    let result = R.map(id => {


        let dialog = R.find(R.pathEq(['user', 'id'], id))(data);
        let avatarLocation = null;
        if (dialog.user.avatar) {
            fileAvatar = R.find(R.propEq('id', dialog.user.avatar))(dialog.user.files);
            avatarLocation = fileAvatar.location;
        }

        let lastMessage = R.find(d => (d.userId === id && d.receiver === ownerId) || (d.userId === ownerId && d.receiver === id))(data);

        return {
            avatarLocation,
            id: dialog.user.id,
            fullName: `${dialog.user.firstName} ${dialog.user.lastName}`,
            createdAt: dialog.createdAt,
            message: `${R.slice(0, 50, lastMessage.text)}...`
        };
    }, partnersIds);

    res.json(result);
};

const conversation = async (req, res, next) => {
    let ownerId = req.session.passport && req.session.passport.user && req.session.passport.user.id;
    let partnerId = req.query.partnerId;
    if (!ownerId || !partnerId)
        return res.sendStatus(400);

    let filter = {
        where: {
            [Op.or]: [
                {
                    userId: ownerId,
                    receiver: partnerId,
                    showToSender: true
                },
                {
                    userId: partnerId,
                    receiver: ownerId,
                    showToReceiver: true
                }
            ]
        },
        order: [
            ['createdAt', 'ASC']
        ]
    };

    let [err, data] = await on(Message.findAll(filter));
    if (err)
        return next(err);

    if (!data)
        res.json([]);

    let response = R.map(message => {
        return {
            id: message.id,
            text: message.text,
            createdAt: message.createdAt,
            right: message.userId === ownerId
        };
    }, data);

    res.json(response);
};

module.exports = {
    create,
    find,
    findById,
    conversation,
    conversationsPartners
};
