const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middlewares/auth.middleware');
const {
  createPostController,
  getAllPostsController,
  getUserFeedController,
  getUserPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
  likePostController,
  unlikePostController,
  addCommentController,
  deleteCommentController,
  searchPostsByTagsController
} = require('../controllers/post.controller');

/*
POST /api/posts - Create a new post (protected)
GET /api/posts - Get all posts
GET /api/posts/feed - Get user's personalized feed (protected)
GET /api/posts/:postId - Get post by ID
PUT /api/posts/:postId - Update post (protected)
DELETE /api/posts/:postId - Delete post (protected)
POST /api/posts/:postId/like - Like a post (protected)
DELETE /api/posts/:postId/like - Unlike a post (protected)
POST /api/posts/:postId/comments - Add comment (protected)
DELETE /api/posts/:postId/comments/:commentId - Delete comment (protected)
GET /api/posts/user/:userId - Get user's posts
GET /api/posts/search/tag - Search posts by tag
*/

// Public routes
router.get('/', getAllPostsController);
router.get('/search/tag', searchPostsByTagsController);

// Feed route must come before :postId to avoid conflicts
router.get('/feed', protectRoute, getUserFeedController);

router.get('/user/:userId', getUserPostsController);
router.get('/:postId', getPostByIdController);

// Protected routes
router.post('/', protectRoute, createPostController);
router.put('/:postId', protectRoute, updatePostController);
router.delete('/:postId', protectRoute, deletePostController);
router.post('/:postId/like', protectRoute, likePostController);
router.delete('/:postId/like', protectRoute, unlikePostController);
router.post('/:postId/comments', protectRoute, addCommentController);
router.delete('/:postId/comments/:commentId', protectRoute, deleteCommentController);

module.exports = router; 