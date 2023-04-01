const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authentication');

router.post('/create', authMiddleware, postController.createPost);
router.put('/edit/:id', authMiddleware, postController.editPost);
router.delete('/delete/:id', authMiddleware, postController.deletePost);

module.exports = router;
