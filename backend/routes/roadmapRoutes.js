const express = require('express');
const router = express.Router();
const {
  getRoadmaps,
  getRoadmapLesson,
  completeTopic,
  getDsaTopics,
  getDsaTopicBySlug,
  completeDsaTopic,
  triggerDsaAiAction,
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getRoadmaps);
router.get('/dsa/topics', getDsaTopics);
router.get('/dsa/topics/:slug', getDsaTopicBySlug);
router.post('/dsa/topics/:slug/complete', completeDsaTopic);
router.post('/dsa/topics/:slug/ai', triggerDsaAiAction);
router.get('/:path/:lessonId', getRoadmapLesson);
router.post('/complete-topic', completeTopic);

module.exports = router;
