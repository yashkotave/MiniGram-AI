const express = require ('express');
const userModel = require('../models/user.model');

const router = express.Router();

/*
POST/register
Post/Login
GET/user protected
*/

router.post('/register', async(req, res) => {
    try {
        const {username, password} = req.body;

        const user = await userModel.create({username, password});

        res.status(201).json({
            message : 'User registered successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
});

module.exports = router;