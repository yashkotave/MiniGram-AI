const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const multer = require('multer');
const {createPostController, getAllPostsController, getUserPostsController, likePostController} = require('../controllers/post.controller');

const upload = multer({storage: multer.memoryStorage()});

// GET => Get all posts
router.get('/', getAllPostsController);

// GET => Get posts by user ID
router.get('/user/:userId', getUserPostsController);

// POST => Create a new post (protected)
router.post('/',
    authMiddleware,
    upload.single('image'),
    createPostController);

// POST => Like/Unlike a post (protected)
router.post('/:postId/like', authMiddleware, likePostController);

module.exports = router; 