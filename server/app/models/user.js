'use strict';

const bcrypt = require('bcryptjs')
    , jwt = require('jsonwebtoken')
    , nodemailer = require('nodemailer')
    , mailerConfig = require('../../config/config.json').mailer
    , transporter = nodemailer.createTransport(mailerConfig);


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING(30)
        },
        lastName: {
            type: DataTypes.STRING(30)
        },
        userType: {
            type: DataTypes.ENUM,
            values: ['admin', 'guru', 'adept'],
            allowNull: false,
            defaultValue: 'adept'
        },
        confirmed: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: false,
            get() {
                return Boolean(this.getDataValue('confirmed'));
            }
        },
        avatar: {
            type: DataTypes.INTEGER(11)
        },
        gender: {
            type: DataTypes.ENUM,
            values: ['male', 'female']
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        language: {
            type: DataTypes.ENUM,
            values: ['en', 'ru'],
            allowNull: false,
            defaultValue: 'en'
        },
        rating: {
            type: DataTypes.TINYINT,
            validate: {
                isNumeric: true,
                min: 10,
                max: 100
            }
        },
        birthDate: {
            type: DataTypes.DATE
        },
        token: {
            type: DataTypes.STRING(64)
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['email', 'userType']
            }
        ]
    });

    User.associate = models => {
        User.hasMany(models.File, {foreignKey: 'userId', as: 'files', onDelete: 'cascade', hooks: true });
        User.hasMany(models.Message, {foreignKey: 'senderId', as: 'messages', onDelete: 'cascade'});
        User.hasMany(models.Comment, {foreignKey: 'senderId', as: 'comments', onDelete: 'cascade'});
        User.hasMany(models.Rating, {foreignKey: 'userId', as: 'ratings', onDelete: 'cascade'});
        User.hasMany(models.UserLanguage, {foreignKey: 'userId', as: 'languages', onDelete: 'cascade'});
        User.hasOne(models.UserInfo, {foreignKey: 'userId', as: 'info', onDelete: 'cascade'});
    };

    User.beforeSave(user => {
        if (user.changed('password'))
            user.password = bcrypt.hashSync(user.password, 10);
    });

    // User.afterCreate(async user => {
    //     try {
    //         let info = await transporter.sendMail({
    //             from: 'Info <info@getmyguru.online>', // sender address
    //             to: user.email, // list of receivers
    //             subject: `Hello, ${user.firstName} ${user.lastName}!`, // Subject line
    //             text: 'Click bellow to confirm your registration...(BETA)'
    //             // html: "<b>Hello world?</b>" // html body
    //         });
    //
    //         console.log('Message sent: %s', info);
    //     }catch (e) {
    //         //@todo send error to logger
    //         console.log('Confirmation message was not send: ', e);
    //     }
    // });

    User.prototype.verifyPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    User.prototype.resetPassword = async function (url) {
        let user = this;
        let token = jwt.sign({}, user.password, {
            algorithm: 'HS256',
            subject: '' + user.id,
            // 10 min
            expiresIn: 60 * 10
        });

        let forgotPwdLink = `${url}/${token}`;

        return await transporter.sendMail({
            from: 'Info <info@getmyguru.online>', // sender address
            to: user.email, // list of receivers
            subject: `Hello, ${user.firstName} ${user.lastName}!`, // Subject line
            text: `You're receiving this e-mail because you requested a password reset for your account. 
            Use the link bellow to set up a new password.
            ${forgotPwdLink}` // plain text body
            // html: "<b>Hello world?</b>" // html body
        });
    };


    User.setNewPassword = async function ({newPassword, token}) {
        let decoded = jwt.decode(token, {complete: true});
        let userId = decoded.payload.sub;

        let user = await User.findByPk(userId);
        if (!user)
            throw new Error('Cannot find user. Token is wrong.');

        jwt.verify(token, user.password);

        let isEqual = bcrypt.compareSync(newPassword, user.password);
        if (isEqual)
            throw new Error('A new password must be different from the old password');

        // The password will be encrypted in 'beforeSave' hook
        return user.update({password: newPassword});
    };

    return User;
};