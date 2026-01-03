const express = require ('express');

const router = express.Router();

/*
POST/register
Post/Login
GET/user protected
*/

router.post('/register', async(req, res) => {
        const {username, password} = req.body;

        const user = await userModel.create({username, password});

        res.status(201).json({
            message : 'User registered successfully',
            user
        })
});

module.exports = router;