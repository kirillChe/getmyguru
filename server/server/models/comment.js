'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        parentId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true
        },
        receiver: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
    Comment.associate = function ({User}) {
        Comment.belongsTo(User, {as: 'user'})
    };
    return Comment;
};