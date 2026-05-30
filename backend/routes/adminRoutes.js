const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, getAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/analytics', getAnalytics);

module.exports = router;
