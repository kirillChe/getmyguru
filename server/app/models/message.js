'use strict';

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        receiverId: {
            allowNull: false,
            type: DataTypes.INTEGER(11).UNSIGNED
        },
        text: {
            type: DataTypes.STRING(3000)
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
        Message.belongsTo(User, {as: 'user', foreignKey: 'senderId', targetKey: 'id'})
    };

    return Message;
};