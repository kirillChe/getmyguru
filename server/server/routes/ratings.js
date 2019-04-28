const express = require('express');
const ratingCtrl = require('../controllers/ratingsController');
const router = express.Router();


router.route('/calculate')
/** GET /api/ratings/calculate - Calculate rating for specific user */
    .get(ratingCtrl.calculate);

router.route('/')
/** GET /api/ratings - Get list of ratings */
    .get(ratingCtrl.find)

    /** POST /api/ratings - Create new rating */
    .post(ratingCtrl.create);

router.route('/:id')
/** GET /api/ratings/:ratingId - Get rating */
    .get(ratingCtrl.findById);


module.exports = router;