const {User, File} = require('../models');
const on = require('await-handler');
const R = require('ramda');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const events = require('events');

const filePath = __dirname + '/../../public';

const create = async (req, res, next) => {
    let [err, user] = await on(User.create(req.body));
    if (err)
        return next(err);

    res.status(201).json(user);
};

const find = async (req, res, next) => {
    let filter = req.query.filter || {};

    let [err, data] = await on(User.findAll(filter));
    if (err)
        return next(err);

    res.json(data);
};

const findById = async (req, res, next) => {
    let [err, user] = await on(User.findByPk(req.params.id));
    if (err)
        return next(err);

    res.json(user);
};

const update = async (req, res, next) => {
    //user can update himself only if he is not admin
    if (req.params.id !== 'me' && req.session.passport.user.userType !== 'admin')
        return res.status(400);

    let userId = req.params.id === 'me' ? req.session.passport.user.id : req.params.id;

    let [err, user] = await on(User.findByPk(userId));
    console.log('usersController.js :44', err, user && user.id);
    if (err)
        return next(err);

    if (!user)
        return res.sendStatus(404);

    let busboy = new Busboy({headers: req.headers});
    let userData = {}, fileProvided = false;
    const em = new events.EventEmitter();

    busboy.on('field', (fieldname, val) => {
        console.log('Field [' + fieldname + ']: value: ' + val);
        userData[fieldname] = val;
    });

    //@todo add image size validation
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        fileProvided = true;

        //validate file type
        if (R.not(R.equals(R.head(R.split('/', mimetype)), 'image'))) {
            console.log('Not allowed file type');
            return em.emit('uploadFinished');
        }

        //validate file size
        if (req.headers['content-length'] / 1024 > 400) {
            console.log('Not allowed file size');
            return em.emit('uploadFinished');
        }

        let name = `${userId}-avatar`;
        let saveTo = path.join(filePath, name);
        let data = {
            userId,
            location: `/api/public/${name}`
        };

        //first, delete old avatar if exist
        try {
            fs.unlinkSync(saveTo);
            await File.destroy({where: data});
        } catch (e) {
            //@todo send to kibana
            console.log('Failed to delete file model or unlink file (avatar): ', e);
        }

        file.on('error', error => {
            //@todo send to kibana and add error handler
            console.log('Upload avatar failed with error: ', error);
            em.emit('uploadFinished');
        });

        file.on('end', async () => {
            //create file model or delete file from fs if got error
            try {
                let file = await File.create(data);
                userData.avatar = file.id;
                userData.avatarLocation = file.location;

            } catch (e) {
                console.log('Failed to create file model (avatar): ', e);
                fs.unlinkSync(saveTo);
            }
            em.emit('uploadFinished');
        });
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('error', error => {
        console.log('Upload failed: ', error);
    });

    busboy.on('finish', async () => {
        console.log('Upload complete');

        //@todo REFACTOR
        if (fileProvided) {
            em.on('uploadFinished', async () => {
                //update user model
                try {
                    let updatedUser = await user.update(userData);
                    updatedUser.setDataValue('avatarLocation', userData.avatarLocation || null);

                    return res.status(200).json(updatedUser);

                } catch (e) {
                    console.log('Failed to update user model: ', e);
                    next(e);
                }
            });
        } else {
            //update user model
            try {
                let updatedUser = await user.update(userData);
                updatedUser.setDataValue('avatarLocation', userData.avatarLocation || null);

                return res.status(200).json(updatedUser);
            } catch (e) {
                console.log('Failed to update user model: ', e);
                next(e);
            }
        }
    });

    req.pipe(busboy);
};

const destroy = async (req, res, next) => {
    try {
        await User.destroy({
            where: {id: req.params.id},
        });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    if (!req.body.email)
        return res.status(400).json('Missing required parameters');

    try {
        //@todo move host/port to config
        let url = `http://${req.host}:3100/reset_password`;

        let ctx = {
            url,
            email: req.body.email
        };

        await User.resetPassword(ctx);

        res.sendStatus(204);
    } catch (error) {
        //@todo add error handler
        next(error);
    }
};

const setNewPassword = async (req, res, next) => {
    let ctx = {
        token: req.body.token,
        newPassword: req.body.newPassword
    };

    if (!ctx.newPassword || !ctx.token)
        return res.status(400).json('Missing required parameters');

    try {
        await User.setNewPassword(ctx);
        res.sendStatus(204);
    } catch (error) {
        //@todo add error handler
        next(error);
    }
};

const getGurusPreviews = async (req, res, next) => {
    req.query.filter.attributes = ['id', 'firstName', 'lastName', 'avatar', 'rating', 'gender'];
    req.query.filter.where = {
        userType: 'guru'
    };

    //@todo refactor
    try {
        let users = await User.findAll(req.query.filter);
        users = R.map(user => {
            user.rating = R.divide(user.rating, 10);
            return user;
        }, users);

        await Promise.all(users.map(async user => {
            if (!user.avatar) {
                user.setDataValue('avatarLocation', null);
            } else {
                let file = await File.findByPk(user.avatar);
                user.setDataValue('avatarLocation', file.location);
            }
        }));

        res.json(users);
    } catch (e) {
        console.log('usersController.js :114', e);
        next(e);
    }
};

const userProfile = async (req, res, next) => {
    //@todo add error handler (try/catch)
    if (!req.params.id)
        return res.status(400);

    let [err, user] = await on(User.findByPk(req.params.id));
    if (err)
        return next(err);

    if (!user)
        return res.sendStatus(404);

    let filter = {
        where: {
            userId: user.id
        }
    };

    let files = await File.findAll(filter);

    let result = R.pickAll(['id', 'firstName', 'lastName', 'gender', 'email', 'language', 'phone', 'age', 'rating'], user);
    result.avatarLocation = null;
    result.images = [];

    R.forEach(file => {
        if (file.id === user.avatar) {
            result.avatarLocation = file.location;
        } else {
            result.images.push(file.location);
        }
    }, files || []);

    res.status(200).json(result);
};


module.exports = {
    create,
    find,
    findById,
    update,
    destroy,
    resetPassword,
    setNewPassword,
    getGurusPreviews,
    userProfile
};
