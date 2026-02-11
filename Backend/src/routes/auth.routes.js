const express = require('express');
const router = express.Router();
const {
  registerController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateProfileController,
  followUserController,
  unfollowUserController,
  getUserByUsernameController
} = require('../controllers/auth.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

/*
POST /auth/register - Register a new user
POST /auth/login - Login a user
POST /auth/logout - Logout a user
GET /auth/me - Get current logged-in user (protected)
PUT /auth/profile - Update user profile (protected)
POST /auth/follow/:userId - Follow a user (protected)
DELETE /auth/unfollow/:userId - Unfollow a user (protected)
GET /auth/user/:username - Get user by username
*/

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', protectRoute, getCurrentUserController);
router.put('/profile', protectRoute, updateProfileController);
router.post('/follow/:userId', protectRoute, followUserController);
router.delete('/unfollow/:userId', protectRoute, unfollowUserController);
router.get('/user/:username', getUserByUsernameController);

module.exports = router;