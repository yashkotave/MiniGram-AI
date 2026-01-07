const express = require ('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const router = express.Router();

/*
POST/register
Post/Login
GET/user protected
*/

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔴 Username required
    if (!username) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    // 🔴 Check existing username
    const userExists = await userModel.findOne({ username });

    if (userExists) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }



    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);

    // ✅ Create user (password as-is)
    const user = await userModel.create({ username, password });

    res.cookie('token', token)

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message
    });
  }
});


module.exports = router;