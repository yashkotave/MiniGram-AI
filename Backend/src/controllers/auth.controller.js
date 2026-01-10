const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// common cookie options
const cookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}

/* =========================
   REGISTER CONTROLLER
========================= */
async function registerController(req, res) {
  try {
    const { username, password } = req.body

    // validation
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      })
    }

    // check existing user
    const existingUser = await userModel.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const user = await userModel.create({
      username,
      password: hashedPassword
    })

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // set cookie
    res.cookie("token", token, cookieOptions)

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error registering user"
    })
  }
}

/* =========================
   LOGIN CONTROLLER
========================= */
async function loginController(req, res) {
  try {
    const { username, password } = req.body

    // validation
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      })
    }

    // check user
    const user = await userModel.findOne({ username })
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // set cookie
    res.cookie("token", token, cookieOptions)

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in"
    })
  }
}

module.exports = {
  registerController,
  loginController
}
