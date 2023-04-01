const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/search_users', userController.searchUsers);

module.exports = router;
