const express = require('express');
const messageCtrl = require('../controllers/messagesController');
const router = express.Router();

/** GET /api/messages/conversation - Get a conversation between two specific users */
router.route('/conversation').get(messageCtrl.conversation);

/** GET /api/messages/conversationsPartners - Get list of conversations partners for specific user */
router.route('/conversationsPartners').get(messageCtrl.conversationsPartners);

router.route('/')
/** GET /api/messages - Get list of messages */
// .get(auth, messageCtrl.list)
    .get(messageCtrl.find)

    /** POST /api/messages - Create new message */
    .post(messageCtrl.create);

router.route('/:id')
/** GET /api/messages/:messageId - Get message */
    .get(messageCtrl.findById);

    /** DELETE /api/messages/:messageId - Delete message */
    // .delete(messageCtrl.destroy);

module.exports = router;