const on = require('await-handler');
const R = require('ramda');
const Op = require('sequelize').Op;
const { Comment, User, File } = require('../models');

const create = async (req, res, next) => {
    let [err, comment] = await on(Comment.create(req.body));
    if (err)
        return next(err);

    res.status(201).json(comment);
};

const commentsTree = async (req, res, next) => {
    let {ownerId} = req.query;
    if (!ownerId)
        return res.sendStatus(400);


    let filter = {
        where: {
            ownerId
        },
        include: [{
            model: User,
            as: 'user',
            include: [{
                model: File,
                as: 'files',
                where: {
                    id: {
                        [Op.col]: 'user.avatar'
                    }
                },
                required: false
            }]
        }],
        order: [
            ['createdAt', 'ASC']
        ]
    };

    let comments = [];

    try {
        comments = await Comment.findAll(filter);

        if (!comments || comments.length === 0)
            return res.json([]);
    } catch (e) {
        return next(e);
    }

    // get all comments with parent id equal null
    let parentComments = R.filter(c => R.isNil(R.prop('parentId', c)), comments);

    //prepare final response and fill children if exist
    let response = R.map(comment => {
        //find child
        let children = R.filter(R.propEq('parentId', comment.id), comments);
        function getCommentData (c) {
            let user = c.user || {};
            return {
                id: c.id,
                userId: user.id,
                userAvatarLocation: (user.files && user.files[0] && user.files[0].location) || null,
                userName: `${user.firstName} ${user.lastName}`,
                userGender: user.gender,
                text: c.text,
                date: c.createdAt
            }
        }
        return R.merge(
            getCommentData(comment),
            {
                children: R.map(getCommentData, children)
            }
        );
    }, parentComments);

    res.json(response);
};

const find = async (req, res, next) => {
    let filter = req.query.filter || {};

    let [err, data] = await on(Comment.findAll(filter));
    if (err)
        return next(err);

    res.json(data);
};

const findById = async (req, res, next) => {
    let [err, comment] = await on(Comment.findByPk(req.params.id));
    if (err)
        return next(err);

    res.json(comment);
};

const update = async (req, res, next) => {
    try {
        const model = await Comment.findByPk(req.params.id);
        if (!model)
            return res.sendStatus(404);
        model.update(req.body);
        res.json(model);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    find,
    findById,
    update,
    commentsTree
};
