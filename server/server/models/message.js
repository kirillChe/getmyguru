'use strict';

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

    return Message;
};