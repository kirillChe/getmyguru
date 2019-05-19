const {User, File} = require('../models');
const on = require('await-handler');
const R = require('ramda');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
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
    // if (req.params.id !== 'me' && req.session.passport.type !== 'admin')
    //     return res.status(400);

    let userId = req.params.id === 'me' ? req.session.passport.id : req.params.id;

    let [err, user] = await on(User.create(User.findByPk(userId)));
    if (err)
        return next(err);

    if (!user)
        return res.sendStatus(404);

    // let {userId, req, res} = ctx;
    let busboy = new Busboy({headers: req.headers});
    let userData = {};

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
        console.log('Field [' + fieldname + ']: value: ' + val);
        userData.fieldname = val;
    });

    //@todo add image size validation
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        let name = `${userId}-avatar`;
        let saveTo = path.join(filePath, name);
        let data = {
            userId,
            location: `api/public/${name}`
        };
        fs.unlinkSync(saveTo);
        let [err, result] = await on(File.destroy({where: data}));
        console.log('_________________HERE: 68________________________', err, result);
        if (err) {
            //@todo send to kibana
            console.log('Failed to delete file model (avatar): ', err);
        }

        file.on('error', error => {
            console.log('Upload avatar failed with error: ', error);
        });

        file.on('end', async () => {
            let [err1, file] = await on(File.create(data));
            if (err1) {
                console.log('Failed to create file model (avatar): ', err1);
                fs.unlinkSync(saveTo);
            } else {
                console.log('File model is created successfully: fileId: ', file.id);
                userData.avatar = file.id;
                userData.avatarLocation = data.location;
            }
        });
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('error', error => {
        console.log('Upload failed: ', error);
    });

    busboy.on('finish', async () => {
        console.log('Upload complete');

        let [err, user] = await on(User.create(userData));
        console.log('_________________HERE: 99________________________', err, user);
        if (err)
            return next(err);

        user.avatarLocation = userData.avatarLocation;

        res.writeHead(200, {'Connection': 'close'});
        res.end("That's all folks!");
        res.status(200).json(user);


    });

    req.pipe(busboy);

















    // console.log('___________________');
    // console.log('___________________');
    // console.dir(req.params, {colors: true, depth: 3});
    // console.dir(req.body, {colors: true, depth: 3});
    // console.dir(req.file, {colors: true, depth: 3});
    // console.log('___________________');
    // console.log('___________________');
    // return next();
    // try {
    //     const model = await User.findByPk(req.params.id);
    //     if (!model)
    //         return res.sendStatus(404);
    //
    //     //@todo check if it works
    //     model.update(req.body);
    //     res.sendStatus(204);
    // } catch (error) {
    //     next(error);
    // }
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

        let info = await User.resetPassword(ctx);

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
    }catch (e) {
        console.log('usersController.js :114', e);
        next(e);
    }
};


module.exports = {
    create,
    find,
    findById,
    update,
    destroy,
    resetPassword,
    setNewPassword,
    getGurusPreviews
};
