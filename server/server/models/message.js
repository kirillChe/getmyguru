'use strict';

const Op = require('sequelize').Op;
const on = require('await-handler');
const R = require('ramda');

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        receiver: {
            allowNull: false,
            type: DataTypes.INTEGER(11).UNSIGNED
        },
        text: {
            type: DataTypes.TEXT
        },
        showToReceiver: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        showToSender: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
    Message.associate = function ({User}) {
        Message.belongsTo(User, {as: 'user'})
    };

    Message.getConversation = async function (ctx) {
        let filter = {
            where: {
                [Op.or]: [
                    {
                        userId: ctx.ownerId,
                        receiver: ctx.partnerId,
                        showToSender: true
                    },
                    {
                        userId: ctx.partnerId,
                        receiver: ctx.ownerId,
                        showToReceiver: true
                    }
                ]
            },
            order: [
                ['createdAt', 'DESC']
            ]
        };

        let [err, data] = await on(Message.findAll(filter));
        if (err)
            throw err;
        return data;
    };

    Message.getPartners = async function (ctx) {
        let filter = {
            where: {
                [Op.or]: [
                    {
                        userId: ctx.ownerId,
                        showToSender: true
                    },
                    {
                        receiver: ctx.ownerId,
                        showToReceiver: true
                    }
                ]
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: ['user']
        };

        let [err, data] = await on(Message.findAll(filter));
        if (err)
            throw err;

        let partnersIds = R.pipe(
            R.map(R.props(['userId', 'receiver'])),
            R.flatten,
            R.uniq,
            R.reject(R.equals(Number(ctx.ownerId)))
        )(data);

        return R.map(id => {
            let dialog = R.find(R.pathEq(['user', 'id'], id))(data);
            return {
                partnerId: dialog.user.id,
                firstName: dialog.user.firstName,
                lastName: dialog.user.lastName,
                createdAt: dialog.createdAt
            };
        }, partnersIds);
    };

    return Message;
};