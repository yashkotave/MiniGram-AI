const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('email-validator');

/* =========================
   REGISTER CONTROLLER
========================= */
async function registerController(req, res) {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    
    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
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
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check user exists and get password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
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
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
}

/* =========================
   UPDATE USER PROFILE CONTROLLER
========================= */
async function updateProfileController(req, res) {
  try {
    const { fullName, bio, profileImage } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName: fullName || undefined,
        bio: bio || undefined,
        profileImage: profileImage || undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
}

/* =========================
   FOLLOW USER CONTROLLER
========================= */
async function followUserController(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself"
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user"
      });
    }

    // Add to following and followers
    await User.updateOne(
      { _id: currentUserId },
      { $push: { following: userId } }
    );

    await User.updateOne(
      { _id: userId },
      { $push: { followers: currentUserId } }
    );

    const updatedUser = await User.findById(currentUserId)
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error('Follow user error:', error);
    return res.status(500).json({
      success: false,
      message: "Error following user",
      error: error.message
    });
  }
}

/* =========================
   UNFOLLOW USER CONTROLLER
========================= */
async function unfollowUserController(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself"
      });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if not following
    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user"
      });
    }

    // Remove from following and followers
    await User.updateOne(
      { _id: currentUserId },
      { $pull: { following: userId } }
    );

    await User.updateOne(
      { _id: userId },
      { $pull: { followers: currentUserId } }
    );

    const updatedUser = await User.findById(currentUserId)
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    return res.status(500).json({
      success: false,
      message: "Error unfollowing user",
      error: error.message
    });
  }
}

/* =========================
   GET USER BY USERNAME CONTROLLER
========================= */
async function getUserByUsernameController(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateProfileController,
  followUserController,
  unfollowUserController,
  getUserByUsernameController
};
