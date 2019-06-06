const on = require('await-handler');
const Op = require('sequelize').Op;
const R = require('ramda');

const {Message, User, File} = require('../models');

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

    //find all conversations for owner
    let messages = [];
    try{
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
            ]
        };

        messages = await Message.findAll(filter);

        //return empty array if no one message was found
        if (!messages || messages.length === 0)
            return res.json([]);

    }catch (e) {
        return next(e);
    }

    // get uniq list of ids of all partners
    let partnersIds = R.pipe(
        R.map(R.props(['userId', 'receiver'])),
        R.flatten,
        R.uniq,
        R.reject(R.equals(Number(ownerId)))
    )(messages);

    //find all partners by their ids
    let users = [];
    try{
        let filter = {
            where: {
                id: {
                    [Op.in]: partnersIds
                }
            },
            include: [{
                model: File,
                as: 'files',
                where: {
                    id: {
                        [Op.col]: 'User.avatar'
                    }
                },
                required: false
            }]
        };

        users = await User.findAll(filter);

        if (!users || users.length === 0)
            return next(new Error('Unexpected error occurred: no one user was found'));

    } catch (e) {
        return next(e);
    }

    //fill final result with list of partners including part of last message
    let result = R.map(id => {
        let user = R.find(R.propEq('id', id))(users);

        let lastMessage = R.find(m => (m.userId === id && m.receiver === ownerId) || (m.userId === ownerId && m.receiver === id))(messages);

        return {
            avatarLocation: (user.files && user.files[0] && user.files[0].location) || null,
            id: id,
            fullName: `${user.firstName} ${user.lastName}`,
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

    let response = R.map(message => ({
        id: message.id,
        text: message.text,
        createdAt: message.createdAt,
        right: message.userId === ownerId
    }), data);

    res.json(response);
};

module.exports = {
    create,
    find,
    findById,
    conversation,
    conversationsPartners
};
