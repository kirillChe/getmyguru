const express = require('express');
const commentCtrl = require('../controllers/commentsController');
const router = express.Router();


router.route('/')
/** GET /api/comments - Get list of comments */
    .get(commentCtrl.find)

    /** POST /api/comments - Create new comment */
    .post(commentCtrl.create);

router.route('/:id')
/** GET /api/comments/:commentId - Get comment */
    .get(commentCtrl.findById)

/** PUT /api/comments/:commentId - Update comment */
    .put(commentCtrl.update);

module.exports = router;