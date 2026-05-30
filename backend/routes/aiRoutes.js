const express = require('express');
const router = express.Router();
const { chat, getChatHistory, clearChatHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/chat', chat);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

module.exports = router;
