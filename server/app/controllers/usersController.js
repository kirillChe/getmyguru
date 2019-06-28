const on = require('await-handler')
    , R = require('ramda')
    , Busboy = require('busboy')
    , path = require('path')
    , fs = require('fs')
    , events = require('events')
    , sequelize = require('sequelize');

//internal modules
const filePath = __dirname + '/../../public'
    , helper = require('./helpers/userHelpers')
    , {User, File, Rating, UserLanguage, UserInfo} = require('../models');

const create = async (req, res, next) => {

    let userData = R.merge(
        R.omit(['country'], req.body),
        {
            info: {
                country: req.body.country
            },
            languages: [
                {
                    code: req.body.language
                }
            ]
        }
    );

    let [err, user] = await on(User.create(userData, {
        include: [
            {
                association: User.associations.languages,
                as: 'languages'
            },
            {
                association: User.associations.info,
                as: 'info'
            }
        ]
    }));
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
    if (!req.query.filter)
        return res.sendStatus(400);

    let users = [];
    try {
        let filter = await helper.prepareGuruFilter(req.query);
        users = await User.findAll(filter);
    } catch (e) {
        console.log('usersController.js :114', e);
        return next(e);
    }

    let previews = R.map(user => {
        return R.merge(
            R.pickAll(['id', 'firstName', 'lastName', 'gender'], user),
            {
                rating: user.rating / 10,
                avatarLocation: (user.files && user.files[0] && user.files[0].location) || null
            }
        );
    }, users);

    res.json(previews);
};

const userProfile = async (req, res, next) => {
    if (!req.params.id)
        return res.status(400);
    
    let user, ratersCount;
    try {
        let filter = {
            where: {
                id: req.params.id
            },
            include: ['files', 'info', 'languages']
        };

        user = await User.findOne(filter);

        if (!user)
            return res.sendStatus(404);

    }catch (e) {
        return next(e);
    }

    try {
        let filter = {
            where: {
                userId: req.params.id
            },
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'ratersCount']],
            raw: true
        };

        let ratings = await Rating.findAll(filter);

        ratersCount = ratings && ratings[0] && ratings[0].ratersCount || 0;

    }catch (e) {
        return next(e);
    }

    let result = {
        avatarLocation: null,
        rating: user.rating / 10,
        ratersCount: ratersCount,
        images: [],
        info: user.info,
        languages: R.map(R.prop('code'), user.languages)
    };

    result = R.merge(
        R.pickAll(['id', 'firstName', 'lastName', 'gender', 'email', 'language', 'birthDate'], user),
        result
    );

    R.forEach(file => {
        if (file.id === user.avatar) {
            result.avatarLocation = file.location;
        } else {
            result.images.push(file.location);
        }
    }, user.files || []);

    res.status(200).json(result);
};

const filtersData = async (req, res, next) => {
    let languagesRange, countriesRange;
    try {
        let languages = await UserLanguage.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('code')) ,'code'],
            ],
            raw: true
        });
        languagesRange = R.map(R.prop('code'), languages);
        let countries = await UserInfo.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('country')) ,'country'],
            ],
            raw: true
        });
        countriesRange = R.map(R.prop('country'), countries);
    } catch (e) {
        return next(e);
    }

    return res.json({languagesRange, countriesRange});
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
    userProfile,
    filtersData
};
