'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const on = require('await-handler');

const mailerConfig = {
    service: 'Gmail',
    auth: {
        user: 'getmyguru.dev@gmail.com',
        pass: 'Aaa068651'
    }
};


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        userType: {
            type: DataTypes.ENUM,
            values: ['admin', 'guru', 'adept'],
            allowNull: false,
            defaultValue: 'adept'
        },
        avatar: {
            type: DataTypes.INTEGER(11)
        },
        gender: {
            type: DataTypes.ENUM,
            values: ['male', 'female'],
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        age: {
            type: DataTypes.INTEGER(2)
        },
        rating: {
            type: DataTypes.TINYINT,
            validate: {
                isNumeric: true,
                min: 10,
                max: 100
            }
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
    }, {});

    User.associate = models => {
        User.hasMany(models.File, {foreignKey: 'userId', as: 'files', onDelete: 'cascade', hooks: true });
        User.hasMany(models.Message, {foreignKey: 'userId', as: 'messages'});
        User.hasMany(models.Comment, {foreignKey: 'userId', as: 'comments'});
        User.hasMany(models.Rating, {foreignKey: 'userId', as: 'ratings'});
    };

    User.beforeSave(user => {
        user.password = bcrypt.hashSync(user.password, 10);
    });

    User.afterCreate(async user => {
        let [err, info] = await on(transporter.sendMail({
            from: 'Info <info@getmyguru.online>', // sender address
            to: user.email, // list of receivers
            subject: `Hello, ${user.firstName} ${user.lastName}!`, // Subject line
            text: 'Click bellow to confirm your registration'
            // html: "<b>Hello world?</b>" // html body
        }));

        console.log("Message sent: %s", err, info);
    });

    User.prototype.verifyPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    User.resetPassword = async function ({url, email}) {

        let [err, user] = await on(User.findOne({ where: {email} }));
        if (err || !user)
            throw err || new Error('User Not Found');

        let token = jwt.sign({}, user.password, {
            algorithm: 'HS256',
            subject: '' + user.id,
            // 24 hours
            expiresIn: 60 * 60 * 24
        });

        let forgotPwdLink = `${url}/${token}`;

        let transporter = nodemailer.createTransport(mailerConfig);

        let [err2, info] = await on(transporter.sendMail({
            from: 'Info <info@getmyguru.online>', // sender address
            to: user.email, // list of receivers
            subject: `Hello, ${user.firstName} ${user.lastName}!`, // Subject line
            text: `You're receiving this e-mail because you requested a password reset for your account. 
            Use the link bellow to set up a new password.
            ${forgotPwdLink}` // plain text body
            // html: "<b>Hello world?</b>" // html body
        }));

        if (err2)
            throw err2;

        return info;
    };

    User.setNewPassword = async function ({newPassword, token}) {
        let decoded = jwt.decode(token, {complete: true});
        let userId = decoded.payload.sub;

        let [err, user] = await on(User.findByPk(userId));
        if (err || !user)
            throw err || new Error('User Not Found');

        try {
            jwt.verify(token, user.password);
        } catch(err2) {
            throw err2;
        }

        let isEqual = bcrypt.compareSync(newPassword, user.password);
        if (isEqual)
            throw new Error('A new password must be different from the old password');

        // The password will be encrypted in 'beforeSave' hook
        return user.update({password: newPassword});
    };

    return User;
};