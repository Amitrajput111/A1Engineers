const mongoose = require('mongoose');
const User = require('../models/User');
const Note = require('../models/Note');
const { users, notes: memoryNotes } = require('../utils/memoryDb');

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    let usersList = [];
    if (mongoose.connection.readyState === 1) {
      usersList = await User.find({}).sort({ createdAt: -1 });
    } else {
      usersList = Array.from(users.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.status(200).json({ success: true, count: usersList.length, users: usersList });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid role' });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      user.role = role;
      await user.save();
    } else {
      user = users.get(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      user.role = role;
      users.set(req.params.id, user);
    }

    res.status(200).json({ success: true, message: 'User role updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system global analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalUsers = await User.countDocuments();
      const totalNotes = await Note.countDocuments();
      const totalRoadmaps = 5; // 5 tracks
      
      const usersList = await User.find({});
      const totalXP = usersList.reduce((acc, curr) => acc + (curr.xp || 0), 0);
      const averageXP = totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0;
      const activeStreaksCount = await User.countDocuments({ streak: { $gt: 0 } });
      const studentsCount = await User.countDocuments({ role: 'student' });
      const adminsCount = await User.countDocuments({ role: 'admin' });

      // Note category aggregates
      const noteCategories = await Note.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        success: true,
        analytics: {
          totalUsers,
          totalNotes,
          totalRoadmaps,
          totalXP,
          averageXP,
          activeStreaksCount,
          noteCategories,
          roles: {
            students: studentsCount,
            admins: adminsCount
          }
        }
      });
    } else {
      // Memory DB fallback analytics
      const usersList = Array.from(users.values());
      const notesList = Array.from(memoryNotes.values());
      
      const totalUsers = usersList.length;
      const totalNotes = notesList.length;
      const totalRoadmaps = 5;
      
      const totalXP = usersList.reduce((acc, curr) => acc + (curr.xp || 0), 0);
      const averageXP = totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0;
      const activeStreaksCount = usersList.filter(u => u.streak > 0).length;
      const studentsCount = usersList.filter(u => u.role === 'student').length;
      const adminsCount = usersList.filter(u => u.role === 'admin').length;

      // Group notes by category
      const categoriesMap = {};
      notesList.forEach(note => {
        const cat = note.category || 'General';
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      });
      const noteCategories = Object.keys(categoriesMap).map(cat => ({
        _id: cat,
        count: categoriesMap[cat]
      }));

      res.status(200).json({
        success: true,
        analytics: {
          totalUsers,
          totalNotes,
          totalRoadmaps,
          totalXP,
          averageXP,
          activeStreaksCount,
          noteCategories,
          roles: {
            students: studentsCount,
            admins: adminsCount
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
