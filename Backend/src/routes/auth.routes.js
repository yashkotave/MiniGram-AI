const express = require ('express');
const router = express.Router();
const { registerController, loginController, logoutController, getCurrentUserController } = require('../controllers/auth.controller');  
const { protectRoute } = require('../middlewares/auth.middleware');

/*
POST /register - Register a new user
POST /login - Login a user
POST /logout - Logout a user
GET /me - Get current logged-in user (protected)
*/

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', protectRoute, getCurrentUserController);

module.exports = router;