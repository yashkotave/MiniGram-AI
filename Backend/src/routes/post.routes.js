const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({storage: multer.memoryStorage()});

//POST => http://localhost:3000 /api/post //protected {image file only bhejni h isliye multer use kr rhe h}


router.post('/',
    authMiddleware,//req.user = User data
    uplaod.single('image'),
    createPostController);


module.exports = router; 