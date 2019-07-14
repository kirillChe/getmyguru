const R = require('ramda')
    , Busboy = require('busboy')
    , path = require('path')
    , fs = require('fs')
    , events = require('events')
    , sequelize = require('sequelize')
    , Op = require('sequelize').Op;

//internal modules
const filePath = __dirname + '/../../public'
    , helper = require('./helpers/userHelpers')
    , {port} = require('../../config/config.json')
    , {User, File, Rating, UserLanguage, UserInfo} = require('../models');

const create = async (req, res) => {
    if (req.body.userType === 'admin')
        return res.status(400).send({
            message: 'What the fuck are you doing?'
        });

    if (!req.body.captcha)
        return res.status(400).send({
            message: 'Please, select captcha'
        });

    //STEP 1. Verify captcha
    try {
        let response = await helper.verifyCaptcha({req});
        if (!response || response.success !== true)
            return res.status(400).send({
                message: 'Invalid captcha'
            });

    } catch (error) {
        return res.status(400).send({
            message: 'Invalid captcha',
            meta: { error }
        });
    }

    //Step 2. Prepare data for saving
    let userData = R.merge(
        R.omit(['country', 'captcha'], req.body),
        {
            info: {},
            languages: [
                {
                    code: req.body.language
                }
            ]
        }
    );

    // may not be provided for some reason
    if (req.body.country)
        userData.info.country = req.body.country;

    // Step 3. Create user
    let user;
    try {
        user = await User.create(userData, {
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
        });
    }catch (error) {
        return res.status(502).send({
            message: 'Cannot create a user',
            meta: {
                error,
                userData
            }
        });
    }

    // Step 4. Send confirmation email
    try{
        let info = await helper.sendConfirmationEmail({req, user});
        console.log('confirmation info sent: ', info);
        res.sendStatus(201);
    }catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while sending confirmation email',
            meta: { error }
        });
    }
};

const confirmEmail = async (req, res) => {
    if (!req.body.token)
        return res.status(400).send({
            message: 'Missing required parameter token'
        });

    let user;
    try {
        let userId = await helper.getUserIdFromToken({token: req.body.token});
        user = await User.findByPk(userId);
        if (!user)
            return res.status(404).send({
                message: 'Wrong token'
            });
    }catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while searching a user',
            meta: { error }
        });
    }

    try {
        await user.update({confirmed: true});
        res.sendStatus(204);
    }catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while trying to confirm the user',
            meta: { error }
        });
    }
};

const update = async (req, res) => {
    //user can update himself only if he is not an admin
    if (req.params.id !== 'me') {
        try {
            let currentUser = await User.findByPk(req.session.passport.user);

            if (!currentUser)
                return res.status(404).send({
                    message: 'User was not found',
                    meta: {userId: req.session.passport.user}
                });

            if (currentUser.type !== 'admin')
                return res.status(400).send({
                    message: 'This user has no permissions for updating other users'
                });

        } catch (error) {
            return res.status(502).send({
                message: 'Some error occurred while searching user from session',
                meta: {
                    error,
                    userId: req.session.passport.user
                }
            });
        }
    }

    let userId = req.params.id === 'me' ? req.session.passport.user : req.params.id;

    let user = null;
    try {
        user = await User.findByPk(userId);

        if (!user)
            return res.status(404).send({
                message: 'User was not found',
                meta: {userId}
            });

    } catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while searching user',
            meta: {
                error,
                userId
            }
        });
    }

    let busboy = new Busboy({headers: req.headers});
    let userData = {}, fileProvided = false;
    const em = new events.EventEmitter();

    busboy.on('field', (fieldname, val) => {
        console.log('Field [' + fieldname + ']: value: ' + val);

        if (fieldname === 'userData') {
            try{
                userData = JSON.parse(val);
            } catch (error) {
                return res.status(502).send({
                    message: 'Field userData must be stringified object',
                    meta: {
                        error,
                        userData
                    }
                });
            }
        }
    });

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
        res.status(502).send({
            message: 'Some error occurred while file/s uploading',
            meta: { error }
        });
    });

    busboy.on('finish', async () => {
        console.log('Upload complete');

        try {
            //@todo REFACTOR
            if (fileProvided) {

                em.on('uploadFinished', async () => {
                    //update user model
                    await helper.updateUserWithAssociations({user, userData});
                    res.sendStatus(201);
                });

            } else {

                //update user model
                await helper.updateUserWithAssociations({user, userData});
                res.sendStatus(201);
            }

        } catch (error) {
            console.log('Failed to update user model: ', e);
            res.status(502).send({
                message: 'Some error occurred while updating a user',
                meta: {
                    error,
                    userData
                }
            });
        }
    });

    req.pipe(busboy);
};

const resetPassword = async (req, res) => {
    let email = req.body.email;
    if (!email)
        return res.status(400).send({
            message: 'Missing required parameter email'
        });

    let user;
    try {
        user = await User.findOne({ where: {email} });
    } catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while trying to find user with provided email',
            meta: {
                error,
                email
            }
        });
    }
    if (!user)
        return res.status(404).send({
            message: 'Cannot find user with provided email',
            meta: { email }
        });

    try {
        //@todo move host/port to config
        let url = `http://${req.host}:${port}/reset_password`;
        let info = await user.resetPassword(url);
        console.log('reset password info: ', info);
        if (info)
            return res.sendStatus(204);

        res.status(502).send({
            message: 'Some error occurred while trying to reset password'
        });

    } catch (error) {
        res.status(502).send({
            message: 'Some error occurred while trying to reset password',
            meta: {
                error,
                email
            }
        });
    }
};

const setNewPassword = async (req, res) => {
    let ctx = {
        token: req.body.token,
        newPassword: req.body.newPassword
    };

    if (!ctx.newPassword || !ctx.token)
        return res.status(400).send({
            message: 'Missing required parameters',
            meta: {
                token: ctx.token,
                newPassword: ctx.newPassword
            }
        });

    try {
        await User.setNewPassword(ctx);
        res.sendStatus(204);
    } catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while trying to set new password',
            meta: {
                token: ctx.token,
                newPassword: ctx.newPassword,
                error
            }
        });
    }
};

const getGurusPreviews = async (req, res) => {
    if (!req.query.filter)
        return res.status(400).send({
            message: 'Missing required parameter filter'
        });

    let users = [];
    try {
        let filter = await helper.prepareGuruFilter(req.query);
        users = await User.findAll(filter);
    } catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while searching the users',
            meta: {
                filter,
                error
            }
        });
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

    res.status(200).json(previews);
};

const userProfile = async (req, res) => {
    if (!req.params.id)
        return res.status(400).send({
            message: 'Missing required parameter id'
        });
    
    let user, ratersCount;
    try {
        let filter = {
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: File,
                    as: 'files',
                    where: {
                        id: {
                            [Op.col]: 'User.avatar'
                        }
                    },
                    required: false
                },
                'info',
                'languages'
            ]
        };

        user = await User.findOne(filter);

        if (!user)
            return res.status(404).send({
                message: 'Cannot find user with provided id',
                meta: { filter }
            });

    }catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while searching a user',
            meta: {
                filter,
                error
            }
        });
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

    }catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while searching the rating for user',
            meta: {
                filter,
                error
            }
        });
    }

    let userAvatar = R.prop('location', R.head(user.files) || {});

    let result = {
        avatarLocation: userAvatar || null,
        rating: user.rating / 10,
        ratersCount: ratersCount,
        info: user.info,
        languages: R.map(R.prop('code'), user.languages)
    };

    result = R.merge(
        R.pickAll(['id', 'firstName', 'lastName', 'gender', 'email', 'language', 'birthDate'], user),
        result
    );

    res.status(200).json(result);
};

const filtersData = async (req, res) => {
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
        res.json({languagesRange, countriesRange});
    } catch (error) {
        return res.status(502).send({
            message: 'Some error occurred while assembling filters data',
            meta: { error }
        });
    }
};

const changeLanguage = async (req, res) => {
    const {language} = req.body;
    if (!language)
        return res.status(400).send({
            message: 'Missing required parameters'
        });

    try {
        let currentUser = await User.findByPk(req.session.passport.user);
        await currentUser.update({language});
        res.sendStatus(204);
    } catch (error) {
        res.status(502).send({
            message: 'Some error occurred while updating user language',
            meta: { error }
        });
    }
};

module.exports = {
    create,
    confirmEmail,
    update,
    resetPassword,
    setNewPassword,
    getGurusPreviews,
    userProfile,
    filtersData,
    changeLanguage
};
