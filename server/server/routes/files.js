const express = require('express');
const fileCtrl = require('../controllers/filesController');
const router = express.Router();

/** POST /api/files/:userId - Upload file */
router.route('/upload/:userId').post(fileCtrl.upload);

/** GET /api/files - Get list of files */
router.route('/').get(fileCtrl.find);

router.route('/:id')
    /** GET /api/files/:fileId - Get file */
    .get(fileCtrl.findById)

    /** DELETE /api/files/:fileId - Delete user */
    .delete(fileCtrl.destroy);

module.exports = router;