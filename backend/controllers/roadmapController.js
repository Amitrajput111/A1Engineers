const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/User');
const { users } = require('../utils/memoryDb');
const { DSA_TOPICS } = require('../utils/dsaContent');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Static metadata mapping for A1 Learner's Course-First Architecture
const ROADMAPS_INDEX = [
  {
    id: 'dsa',
    title: 'DSA & Problem Solving',
    description: 'Master arrays, strings, binary search, recursion, trees, and dynamic programming in a highly visual environment.',
    category: 'DSA & Problem Solving',
    courses: [
      {
        id: 'dsa-visual',
        title: 'Visual Data Structures & Algorithms',
        duration: '20 hours',
        difficulty: 'Beginner to Hard',
        modules: [
          {
            title: 'Visual Core DSA',
            lessons: [
              { id: 'arrays', title: 'Arrays', xpReward: 100 },
              { id: 'strings', title: 'Strings', xpReward: 100 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Full Stack Development',
    description: 'Build complete high-scale responsive systems using the React MERN Stack.',
    category: 'Full Stack Development',
    courses: [
      {
        id: 'react-mastery',
        title: 'Modern Front-End Mastery with React',
        duration: '15 hours',
        difficulty: 'Medium',
        modules: [
          {
            title: 'Functional Components & Hooks',
            lessons: [
              { id: 'react-hooks', title: 'React state & Effect Hooks', xpReward: 100 },
              { id: 'react-context', title: 'Context API & State Batching Mechanics', xpReward: 120 }
            ]
          },
          {
            title: 'Express Backend APIs',
            lessons: [
              { id: 'node-express-foundations', title: 'Node REST APIs & Middleware Pipeline', xpReward: 120 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai-ml',
    title: 'AI Engineering',
    description: 'Master Python vector calculations, data models, and neural networks.',
    category: 'AI Engineering',
    courses: [
      {
        id: 'data-analytics',
        title: 'Vector Calculations & Data Cleanups',
        duration: '8 hours',
        difficulty: 'Easy',
        modules: [
          {
            title: 'Data Foundations stack',
            lessons: [
              { id: 'numpy-foundations', title: 'NumPy Array Foundations', xpReward: 100 },
              { id: 'pandas-dataframes', title: 'Pandas DataFrames & Aggregations', xpReward: 120 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Protect applications, study SQL injections, and understand network security.',
    category: 'Cybersecurity',
    courses: [
      {
        id: 'security-fundamentals',
        title: 'Application & Network Security',
        duration: '10 hours',
        difficulty: 'Medium',
        modules: [
          {
            title: 'Web Application Security',
            lessons: [
              { id: 'sql-injection', title: 'SQL Injection Attacks & Defensive Queries', xpReward: 100 }
            ]
          }
        ]
      }
    ]
  }
];

// @desc    Get all roadmaps index
// @route   GET /api/roadmaps
// @access  Private
exports.getRoadmaps = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: ROADMAPS_INDEX.length,
      roadmaps: ROADMAPS_INDEX,
      completedLessons: req.user.completedLessons || [],
      currentCourseId: req.user.currentCourseId || ''
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed lesson content directly from File-Based CMS
// @route   GET /api/roadmaps/:path/:lessonId
// @access  Private
exports.getRoadmapLesson = async (req, res, next) => {
  try {
    const { path: categoryPath, lessonId } = req.params;

    // Validate path inputs to prevent folder traversals
    if (!['dsa', 'web-development', 'ai-ml'].includes(categoryPath)) {
      return res.status(400).json({ success: false, error: 'Invalid category track specified' });
    }

    const sanitizedLessonId = path.basename(lessonId, '.json');
    const filePath = path.join(__dirname, `../../content/${categoryPath}/${sanitizedLessonId}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: `Lesson file not found: ${categoryPath}/${sanitizedLessonId}` });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lessonData = JSON.parse(fileContent);

    // Save as current active course for user
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id);
    } else {
      user = users.get(req.user.id);
    }
    if (user) {
      user.currentCourseId = `${categoryPath}/${sanitizedLessonId}`;
      await user.save();
    }

    res.status(200).json({
      success: true,
      lesson: lessonData,
      lessonId: `${categoryPath}/${sanitizedLessonId}`,
      isCompleted: req.user.completedLessons.includes(`${categoryPath}/${sanitizedLessonId}`)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a lesson topic complete (rewards XP and streak)
// @route   POST /api/roadmaps/complete-topic
// @access  Private
exports.completeTopic = async (req, res, next) => {
  try {
    const { lessonId, xpReward } = req.body; // format: "dsa/arrays-basics"

    if (!lessonId) {
      return res.status(400).json({ success: false, error: 'Please specify the lessonId to complete' });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id);
    } else {
      user = users.get(req.user.id);
    }

    // Check if already completed
    if (user.completedLessons.includes(lessonId)) {
      return res.status(400).json({ success: false, error: 'Lesson topic already marked completed' });
    }

    user.completedLessons.push(lessonId);
    
    // Reward XP
    const xpEarned = xpReward || 100;
    user.xp += xpEarned;

    // Update streak (if next day, increment; if same day, keep; if reset, set to 1)
    const now = new Date();
    if (user.streakLastUpdated) {
      const lastUpdate = new Date(user.streakLastUpdated);
      const diffTime = Math.abs(now - lastUpdate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.streakLastUpdated = now;

    await user.save();

    res.status(200).json({
      success: true,
      message: `Completed lesson. Earned +${xpEarned} XP!`,
      xp: user.xp,
      streak: user.streak,
      completedLessons: user.completedLessons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all 14 DSA topics with completion statuses
// @route   GET /api/roadmaps/dsa/topics
// @access  Private
exports.getDsaTopics = async (req, res, next) => {
  try {
    const userCompleted = req.user.completedLessons || [];
    
    // Map topics list with completion status
    const topicsList = Object.values(DSA_TOPICS).map(topic => {
      const topicKey = `dsa-topic/${topic.slug}`;
      return {
        slug: topic.slug,
        name: topic.name,
        difficulty: topic.difficulty,
        sequenceOrder: topic.sequenceOrder,
        completed: userCompleted.includes(topicKey)
      };
    });

    // Sort by sequenceOrder
    topicsList.sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    res.status(200).json({
      success: true,
      count: topicsList.length,
      topics: topicsList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get details for a single DSA topic
// @route   GET /api/roadmaps/dsa/topics/:slug
// @access  Private
exports.getDsaTopicBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const topic = DSA_TOPICS[slug.toLowerCase()];

    if (!topic) {
      return res.status(404).json({ success: false, error: 'DSA topic not found' });
    }

    const topicKey = `dsa-topic/${slug.toLowerCase()}`;
    const isCompleted = req.user.completedLessons.includes(topicKey);

    res.status(200).json({
      success: true,
      topic,
      isCompleted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a DSA topic completed (rewards XP & streak)
// @route   POST /api/roadmaps/dsa/topics/:slug/complete
// @access  Private
exports.completeDsaTopic = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const topic = DSA_TOPICS[slug.toLowerCase()];

    if (!topic) {
      return res.status(404).json({ success: false, error: 'DSA topic not found' });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id);
    } else {
      user = users.get(req.user.id);
    }

    const topicKey = `dsa-topic/${slug.toLowerCase()}`;
    
    // Check if already completed
    if (user.completedLessons.includes(topicKey)) {
      return res.status(200).json({
        success: true,
        message: 'Topic already completed',
        xp: user.xp,
        streak: user.streak,
        completedLessons: user.completedLessons
      });
    }

    user.completedLessons.push(topicKey);
    user.xp += 100;

    // Streak logic
    const now = new Date();
    if (user.streakLastUpdated) {
      const lastUpdate = new Date(user.streakLastUpdated);
      const diffTime = Math.abs(now - lastUpdate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.streakLastUpdated = now;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Topic marked completed! Earned +100 XP!',
      xp: user.xp,
      streak: user.streak,
      completedLessons: user.completedLessons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger AI action on DSA topic (Explain Simpler, Another Example, Quiz Me)
// @route   POST /api/roadmaps/dsa/topics/:slug/ai
// @access  Private
exports.triggerDsaAiAction = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { action } = req.body; // 'explain-simpler' | 'another-example' | 'quiz-me'
    const topic = DSA_TOPICS[slug.toLowerCase()];

    if (!topic) {
      return res.status(404).json({ success: false, error: 'DSA topic not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let responseText = '';

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let promptText = '';
        if (action === 'explain-simpler') {
          promptText = `You are a friendly computer science tutor. Explain the concept of "${topic.name}" in simpler, beginner-friendly language. Avoid using jargon or long paragraphs. Max 150 words. Current Explanation:\n${topic.understand.explanation}`;
        } else if (action === 'another-example') {
          promptText = `Generate a new, creative, and memorable real-world analogy to explain "${topic.name}" to a absolute beginner. Max 100 words. Existing analogy:\n${topic.understand.analogy}`;
        } else if (action === 'quiz-me') {
          promptText = `Generate exactly 3 short multiple choice questions (with 3 options each) to test understanding of "${topic.name}". Output in clean JSON format matching this schema:
[
  {
    "question": "question text",
    "options": ["A", "B", "C"],
    "answer": "matching option text"
  }
]
Do not output markdown code blocks wrapper, output raw JSON only.`;
        }

        const result = await model.generateContent(promptText);
        const response = await result.response;
        responseText = response.text();
      } catch (geminiError) {
        console.error('Gemini error during DSA AI action, fallback active:', geminiError.message);
        responseText = getDsaAiFallback(topic.name, action);
      }
    } else {
      responseText = getDsaAiFallback(topic.name, action);
    }

    // If it's a quiz, try to parse it to JSON
    let parsedResult = responseText;
    if (action === 'quiz-me') {
      try {
        const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleaned);
      } catch (parseErr) {
        parsedResult = getDsaAiFallback(topic.name, 'quiz-me-parsed');
      }
    }

    res.status(200).json({
      success: true,
      action,
      result: parsedResult
    });
  } catch (error) {
    next(error);
  }
};

// Fallback provider for DSA AI actions when offline or Gemini fails
function getDsaAiFallback(topicName, action) {
  if (action === 'explain-simpler') {
    return `Let's break down ${topicName} in a super simple way. Think of it as a linear chest of drawers. Every drawer is labelled with a number (0, 1, 2...). You can put items inside, and you can grab any item directly if you know which drawer number it is in. It's fast and organized, but if you want to insert a new drawer in the middle, you have to push all the other drawers down!`;
  }
  if (action === 'another-example') {
    return `Locker Room Analogy: Think of ${topicName} as a row of school lockers. Each locker is assigned a number (Index). You can walk directly to locker #5 and open it instantly. You don't have to open lockers 1, 2, 3, or 4 first. This direct access makes finding things fast!`;
  }
  
  return [
    {
      question: `In ${topicName}, what is the time complexity of looking up an element directly using its index?`,
      options: ["O(1)", "O(n)", "O(log n)"],
      answer: "O(1)"
    },
    {
      question: `Which of the following represents a key characteristic of ${topicName}?`,
      options: [
        "Elements are linked via pointers.",
        "Elements are stored in contiguous memory.",
        "Elements must always be sorted."
      ],
      answer: "Elements are stored in contiguous memory."
    },
    {
      question: `What is the time complexity of deleting an element from the beginning of an unsorted ${topicName} (requiring shifting)?`,
      options: ["O(1)", "O(log n)", "O(n)"],
      answer: "O(n)"
    }
  ];
}
