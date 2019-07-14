const express = require('express');
const userCtrl = require('../controllers/usersController');
const router = express.Router();


/** GET /api/users/resetPassword - Send a link for reset password */
router.route('/resetPassword').post(userCtrl.resetPassword);

router.route('/confirmEmail').post(userCtrl.confirmEmail);

router.route('/setNewPassword').post(userCtrl.setNewPassword);

router.route('/getGurusPreviews').get(userCtrl.getGurusPreviews);

router.route('/userProfile/:id').get(userCtrl.userProfile);

router.route('/filtersData').get(userCtrl.filtersData);

router.route('/changeLanguage').put(userCtrl.changeLanguage);

router.route('/').post(userCtrl.create);

router.route('/:id').put(userCtrl.update);

    /** DELETE /api/users/:userId - Delete user */
    // .delete(userCtrl.destroy);

module.exports = router;