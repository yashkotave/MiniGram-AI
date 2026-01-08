const express = require ('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/auth.controller');  
/*
POST/register
Post/Login
GET/user protected
*/

router.post('/register', registerController);
router.post('/login', loginController);


module.exports = router;