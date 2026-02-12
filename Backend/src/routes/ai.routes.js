const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middlewares/auth.middleware');
const {
  generateCaptionController,
  generateCaptionSuggestionsController,
  generateHashtagsController
} = require('../controllers/ai.controller');

/*
POST /api/ai/generate-caption - Generate a single caption
POST /api/ai/generate-suggestions - Generate multiple caption suggestions
POST /api/ai/generate-hashtags - Generate hashtags for a caption
*/

router.post('/generate-caption', protectRoute, generateCaptionController);
router.post('/generate-suggestions', protectRoute, generateCaptionSuggestionsController);
router.post('/generate-hashtags', protectRoute, generateHashtagsController);

module.exports = router;
