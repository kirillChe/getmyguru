const on = require('await-handler')
    , Op = require('sequelize').Op
    , R = require('ramda')
    , {File, User} = require('../models');


const upload = async (req, res, next) => {
    //check if user is admin if user id is provided
    if (req.params.id !== 'me') {
        try {
            let currentUser = await User.findByPk(req.session.passport.user);
            if (currentUser.type !== 'admin')
                return res.status(400).json({errorName: 'SCOPE_ERROR'});
        } catch (e) {
            return next(e);
        }
    }

    let userId = req.params.id === 'me' ? req.session.passport.user : req.params.id;

    let ctx = {
        req, res, userId
    };
    try {
        await File.upload(ctx);
    } catch (e) {
        next(e);
    }
};

const findById = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let [err, file] = await on(File.findByPk(req.params.id));
    if (err)
        return next(err);

    res.status(200).json(file);
};

const userImages = async (req, res, next) => {
    try {
        let filter = {
            where: {
                id: req.params.id
            },
            include: [{
                model: File,
                as: 'files',
                where: {
                    id: {
                        [Op.ne]: {
                            [Op.col]: 'User.avatar'
                        }
                    }
                }
            }]
        };
        let user = await User.findOne(filter);
        let images = R.map(file => ({
            id: file.id,
            url: file.location
        }), user && user.files || []);

        res.status(200).json(images);
    } catch (e) {
        return next(e);
    }
};

const find = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let filter = req.query.filter || {};

    if (filter.where) {
        filter.where.userId = req.params.userId;
    } else {
        filter.where = {
            userId: req.params.userId
        };
    }

    let [err, data] = await on(File.findAll(filter));
    if (err)
        return next(err);

    res.status(200).json(data);
};

const destroy = async (req, res, next) => {
    // @todo add scoping validation
    /**
     * req.session.passport.user.type === 'admin'
     * req.session.passport.user.id === req.params.userId
     */
    let [err, file] = await on(File.findByPk(req.params.id));
    if (err)
        return next(err);

    if (!file)
        return res.sendStatus(404);

    try {
        await file.destroy();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};



module.exports = {
    upload,
    userImages,
    find,
    findById,
    destroy
};
