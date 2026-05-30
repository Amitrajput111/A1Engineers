const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  duration: {
    type: String, // e.g. "30 mins"
    required: true,
  },
  content: {
    type: String, // markdown content or detailed explanation
    required: true,
  },
  codeExample: {
    type: String, // boilerplate or standard code solution
  },
  xpReward: {
    type: Number,
    default: 100, // XP rewarded on completion
  },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  topics: [topicSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a roadmap title'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a roadmap description'],
    },
    category: {
      type: String,
      enum: ['DSA', 'Web Development', 'AI/ML', 'Cybersecurity'],
      required: true,
    },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
