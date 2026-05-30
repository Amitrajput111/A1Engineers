const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { users, MemoryUser } = require('../utils/memoryDb');

// Helper to set cookie options
const getCookieOptions = (expireTime) => {
  return {
    expires: new Date(Date.now() + expireTime),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
};

// Helper to send response with tokens
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.getSignedToken();
  const refreshToken = user.getRefreshToken();

  // Set cookies
  res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15m
  res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7d

  res.status(statusCode).json({
    success: true,
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      xp: user.xp,
      streak: user.streak,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      // Create user
      user = await User.create({
        name,
        email,
        password,
      });
    } else {
      // Memory check
      const normalizedEmail = email.toLowerCase();
      const existingUser = Array.from(users.values()).find(u => u.email === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }
      user = new MemoryUser({
        name,
        email,
        password,
      });
      await user.save();
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      // Find user and include password field
      user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Check password match
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    } else {
      // Memory check
      const normalizedEmail = email.toLowerCase();
      user = Array.from(users.values()).find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }

    // Update login streak
    const now = new Date();
    if (user.streakLastUpdated) {
      const lastUpdate = new Date(user.streakLastUpdated);
      const diffTime = Math.abs(now - lastUpdate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak += 1;
        user.xp += 50; // Bonus XP for maintaining streak
      } else if (diffDays > 1) {
        user.streak = 1; // Reset streak
      }
    } else {
      user.streak = 1; // Initial streak
      user.xp += 50;
    }
    user.streakLastUpdated = now;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth exchange
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, error: 'Missing information from Google OAuth' });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      // Find user or create if not exists
      user = await User.findOne({ email });
      if (!user) {
        // Create user with a random secure password since it is OAuth
        const randomPassword = Math.random().toString(36).slice(-12) + 'OAuth!';
        user = await User.create({
          name,
          email,
          password: randomPassword,
          avatar: avatar || '',
        });
      }
    } else {
      // Memory check
      const normalizedEmail = email.toLowerCase();
      user = Array.from(users.values()).find(u => u.email === normalizedEmail);
      if (!user) {
        user = new MemoryUser({
          name,
          email,
          password: 'mock_password',
          avatar: avatar || '',
        });
      }
    }

    // Update streak
    const now = new Date();
    if (user.streakLastUpdated) {
      const lastUpdate = new Date(user.streakLastUpdated);
      const diffTime = Math.abs(now - lastUpdate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak += 1;
        user.xp += 50;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
      user.xp += 50;
    }
    user.streakLastUpdated = now;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    let token;
    
    if (req.cookies && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    } else if (req.body.refreshToken) {
      token = req.body.refreshToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'No refresh token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id);
    } else {
      user = users.get(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = user.getSignedToken();
    
    // Reset cookie
    res.cookie('accessToken', newAccessToken, getCookieOptions(15 * 60 * 1000));

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & Clear cookies
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('accessToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id);
    } else {
      user = users.get(req.user.id);
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id);
    } else {
      user = users.get(req.user.id);
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
