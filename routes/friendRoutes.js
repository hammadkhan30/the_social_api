const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authentication');

router.post('/sendRequest/:id', authMiddleware, friendController.sendRequest);
router.post('/acceptRequest/:id', authMiddleware, friendController.acceptRequest);
router.get('/friendsPosts', authMiddleware, friendController.getFriendsPosts);

module.exports = router;
