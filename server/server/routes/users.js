const express = require('express');
const userCtrl = require('../controllers/usersController');
const router = express.Router();


/** GET /api/users/resetPassword - Send a link for reset password */
router.route('/resetPassword').get(userCtrl.resetPassword);

/** GET /api/users/validateResetToken - Send a link for reset password */
router.route('/validateResetToken').get(userCtrl.validateResetToken);

/** GET /api/users/resetPassword - Send a link for reset password */
router.route('/:id/setNewPassword').put(userCtrl.setNewPassword);

router.route('/')
/** GET /api/users - Get list of users */
    .get(userCtrl.find)

    /** POST /api/users - Create new user */
    .post(userCtrl.create);

router.route('/:id')
/** GET /api/users/:userId - Get user */
    .get(userCtrl.findById)

    /** PUT /api/users/:userId - Update user */
    .put(userCtrl.update)

    /** DELETE /api/users/:userId - Delete user */
    .delete(userCtrl.destroy);

// /** Load user when API with userId route parameter is hit */
// router.param('userId', userCtrl.load);

module.exports = router;