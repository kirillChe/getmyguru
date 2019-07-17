const Op = require('sequelize').Op
    , R = require('ramda');

const {Message, User, File} = require('../models');

// the request is sending by sockets. You can find code in app.js
const conversationsPartners = async (req, res) => {
    let ownerId = req.session.passport && req.session.passport.user;
    if (!ownerId)
        return res.status(400).send({ message: 'Missing required parameter ownerId' });

    //find all conversations for owner
    let messages = [], filter = {};
    try{
        filter = {
            where: {
                [Op.or]: [
                    {
                        senderId: ownerId,
                        showToSender: true
                    },
                    {
                        receiverId: ownerId,
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
        return res.status(502).send({
            message: 'Some error occurred while searching messages',
            meta: {
                error: e.message,
                filter
            }
        });
    }

    // get uniq list of ids of all partners
    let partnersIds = R.pipe(
        R.map(R.props(['senderId', 'receiverId'])),
        R.flatten,
        R.uniq,
        R.reject(R.equals(Number(ownerId)))
    )(messages);

    //find all partners by their ids
    let users = [];
    try{
        filter = {
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
            return res.status(502).send({
                message: 'Unexpected error occurred: no one user was found',
                meta: { filter }
            });

    } catch (e) {
        return res.status(502).send({
            message: 'Some error occurred while searching users',
            meta: {
                error: e.message,
                filter
            }
        });
    }

    //fill final result with list of partners including part of last message
    let result = R.map(id => {
        let user = R.find(R.propEq('id', id))(users);

        let lastMessage = R.find(m => (m.senderId === id && m.receiverId === ownerId) || (m.senderId === ownerId && m.receiverId === id))(messages);

        return {
            avatarLocation: (user.files && user.files[0] && user.files[0].location) || null,
            id: id,
            fullName: `${user.firstName} ${user.lastName}`,
            message: `${R.slice(0, 50, lastMessage.text)}...`
        };
    }, partnersIds);

    res.json(result);
};

const conversation = async (req, res) => {
    let ownerId = req.session.passport && req.session.passport.user;
    let partnerId = req.query.partnerId;
    if (!ownerId || !partnerId)
        return res.status(502).send({
            message: 'Missing required parameters',
            meta: { partnerId, ownerId }
        });

    let filter = {
        where: {
            [Op.or]: [
                {
                    senderId: ownerId,
                    receiverId: partnerId,
                    showToSender: true
                },
                {
                    senderId: partnerId,
                    receiverId: ownerId,
                    showToReceiver: true
                }
            ]
        },
        order: [
            ['createdAt', 'ASC']
        ]
    };

    try {
        let data = await Message.findAll(filter);
        if (!data)
            return res.status(200).json([]);

        let response = R.map(message => ({
            id: message.id,
            text: message.text,
            createdAt: message.createdAt,
            right: message.senderId === ownerId
        }), data);

        res.json(response);

    } catch (e) {
        return res.status(502).send({
            message: 'Some error occurred while searching users',
            meta: {
                error: e.message,
                filter
            }
        });
    }
};

module.exports = {
    conversation,
    conversationsPartners
};
