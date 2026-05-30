const jwt = require('jsonwebtoken');

// In-Memory Collections
const users = new Map();
const notes = new Map();
const chats = new Map();

// Helper to generate a MongoDB-like ObjectId string
const generateId = () => Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

// Class representing an In-Memory User Document (mocks Mongoose doc)
class MemoryUser {
  constructor(data) {
    this._id = data._id || generateId();
    this.id = this._id;
    this.name = data.name;
    this.email = data.email.toLowerCase();
    this.password = data.password;
    this.avatar = data.avatar || '';
    this.role = data.role || 'student';
    this.xp = data.xp || 0;
    this.streak = data.streak || 0;
    this.streakLastUpdated = data.streakLastUpdated || null;
    this.completedLessons = data.completedLessons || [];
    this.currentCourseId = data.currentCourseId || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async matchPassword(enteredPassword) {
    // Basic password matching for development/fallback
    return enteredPassword === this.password || this.password === 'mock_password';
  }

  getSignedToken() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });
  }

  getRefreshToken() {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
  }

  async save() {
    this.updatedAt = new Date();
    users.set(this._id, this);
    return this;
  }
}

// Seed data
const defaultUserId = '60d5ec49f83c2c1a403d12f3';
const seedUser = new MemoryUser({
  _id: defaultUserId,
  name: 'Amit Rajput (OAuth)',
  email: 'amit.rajput.oauth@gmail.com',
  password: 'mock_password',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120',
  role: 'student',
  xp: 120,
  streak: 3,
  completedLessons: [],
  currentCourseId: '',
});
users.set(defaultUserId, seedUser);

// Seed notes
const defaultNoteId = '60d5ec49f83c2c1a403d12f4';
notes.set(defaultNoteId, {
  _id: defaultNoteId,
  userId: defaultUserId,
  title: 'My First DSA Note',
  content: `# Summary\nThis is my first DSA note on array rotations and Kadane's algorithm.`,
  category: 'DSA',
  createdAt: new Date(),
  updatedAt: new Date(),
});

module.exports = {
  users,
  notes,
  chats,
  MemoryUser,
  generateId,
};
