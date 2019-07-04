const express = require('express')
    , commentCtrl = require('../controllers/commentsController')
    , router = express.Router();

/** GET /api/comments/commentsTree - Get a comments tree for specific user */
router.route('/commentsTree').get(commentCtrl.commentsTree);

router.route('/')
/** GET /api/comments - Get list of comments */
    // .get(commentCtrl.find)

    /** POST /api/comments - Create new comment */
    .post(commentCtrl.create);

// router.route('/:id')
/** GET /api/comments/:commentId - Get comment */
    // .get(commentCtrl.findById)

/** PUT /api/comments/:commentId - Update comment */
    // .put(commentCtrl.update);

module.exports = router;