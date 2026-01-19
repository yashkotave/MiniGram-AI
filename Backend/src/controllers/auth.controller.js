const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
/* =========================
   REGISTER CONTROLLER
========================= */
async function registerController(req, res) {
  try {
    const { username, password } = req.body;    
    // 1️⃣ username required
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // 2️⃣ check existing user (username only)
    const isUserAlreadyExists = await userModel.findOne({ username });
    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 3️⃣ create user
    const user = await userModel.create({ 
        username, 
        password: await bcrypt.hash(password, 10)   
     });

    // 4️⃣ generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    // 5️⃣ set cookie
    res.cookie("token", token, {
      httpOnly: true
    });

    // 6️⃣ response
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
      error: error.message
    });
  }
}

/* =========================
   LOGIN CONTROLLER
========================= */
async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    // 1️⃣ check user exists
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // 2️⃣ check password (plain for now)
    if (bcrypt.compareSync(password, user.password) === false ) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }


    // 3️⃣ generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
    );

    // 4️⃣ set cookie
    res.cookie("token", token, {
      httpOnly: true
    });

    // 5️⃣ response
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message
    });
  }
}

/* =========================
   LOGOUT CONTROLLER
========================= */
async function logoutController(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      error: error.message
    });
  }
}

/* =========================
   GET CURRENT USER CONTROLLER
========================= */
async function getCurrentUserController(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user",
      error: error.message
    });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getCurrentUserController
};
