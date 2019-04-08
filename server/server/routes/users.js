const express = require('express');
const userCtrl = require('../controllers/usersController');
// import auth from '../../config/jwt';

const router = express.Router();


router.route('/')
/** GET /api/users - Get list of users */
// .get(auth, userCtrl.list)
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