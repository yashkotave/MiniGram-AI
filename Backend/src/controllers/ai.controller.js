const { generateCaption, generateCaptionSuggestions, generateHashtags } = require('../service/ai.service');

/* =========================
   GENERATE CAPTION CONTROLLER
========================= */
async function generateCaptionController(req, res) {
  try {
    const { imageDescription, base64Image = null } = req.body;

    if (!imageDescription || imageDescription.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Image description is required"
      });
    }

    const caption = await generateCaption(imageDescription, base64Image);

    return res.status(200).json({
      success: true,
      message: "Caption generated successfully",
      caption
    });
  } catch (error) {
    console.error('Generate caption error:', error);
    return res.status(500).json({
      success: false,
      message: "Error generating caption",
      error: error.message
    });
  }
}

/* =========================
   GENERATE CAPTION SUGGESTIONS CONTROLLER
========================= */
async function generateCaptionSuggestionsController(req, res) {
  try {
    const { imageDescription } = req.body;

    if (!imageDescription || imageDescription.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Image description is required"
      });
    }

    const suggestions = await generateCaptionSuggestions(imageDescription);

    return res.status(200).json({
      success: true,
      message: "Caption suggestions generated successfully",
      suggestions
    });
  } catch (error) {
    console.error('Generate suggestions error:', error);
    return res.status(500).json({
      success: false,
      message: "Error generating suggestions",
      error: error.message
    });
  }
}

/* =========================
   GENERATE HASHTAGS CONTROLLER
========================= */
async function generateHashtagsController(req, res) {
  try {
    const { caption } = req.body;

    if (!caption || caption.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Caption is required"
      });
    }

    const hashtags = await generateHashtags(caption);

    return res.status(200).json({
      success: true,
      message: "Hashtags generated successfully",
      hashtags
    });
  } catch (error) {
    console.error('Generate hashtags error:', error);
    return res.status(500).json({
      success: false,
      message: "Error generating hashtags",
      error: error.message
    });
  }
}

module.exports = {
  generateCaptionController,
  generateCaptionSuggestionsController,
  generateHashtagsController
};
