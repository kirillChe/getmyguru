const R = require('ramda')
    , Op = require('sequelize').Op
    , { Comment, User, File } = require('../models');

const create = async (req, res) => {
    try {
        let comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (e) {
        res.status(502).send({
            message: 'Cannot create a comment',
            meta: {
                error: e.message
            }
        });
    }
};

const commentsTree = async (req, res) => {
    let {ownerId} = req.query;
    if (!ownerId)
        return res.status(400).send({
            message: 'Missing required parameter ownerId'
        });


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
        return res.status(502).send({
            message: 'Some error occurred while searching owner\'s comments tree',
            meta: {
                error: e.message
            }
        });
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

module.exports = {
    create,
    commentsTree
};
