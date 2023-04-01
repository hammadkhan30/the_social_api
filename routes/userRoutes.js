const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authentication');

router.post('/register', userController.register);
router.post('/signIn', userController.signIn);
router.post('/send_friend_request', userController.sendFriendRequest);
router.get('/friend_requests', authMiddleware, userController.viewFriendRequests);


module.exports = router;
