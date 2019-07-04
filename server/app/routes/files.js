const express = require('express')
    , fileCtrl = require('../controllers/filesController')
    , router = express.Router();

/** POST /api/files/upload/:userId - Upload file */
router.route('/upload/:id').post(fileCtrl.upload);

/** GET /api/files/userImages/:userId - Get user images */
router.route('/userImages/:id').get(fileCtrl.userImages);

/** GET /api/files - Get list of files */
// router.route('/').get(fileCtrl.find);

router.route('/:id')
    /** GET /api/files/:fileId - Get file */
    // .get(fileCtrl.findById)

    /** DELETE /api/files/:fileId - Delete user */
    .delete(fileCtrl.destroy);

module.exports = router;