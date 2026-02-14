const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate caption for an image using Google Gemini AI
 * @param {string} imageDescription - Description or tags for the image
 * @param {string} base64Image - Optional base64 encoded image
 * @returns {Promise<string>} Generated caption
 */
async function generateCaption(imageDescription, base64Image = null) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        let prompt = `Generate a creative, engaging Instagram caption for an image with the following description: "${imageDescription}". 
        The caption should:
        - Be catchy and engaging
        - Include relevant hashtags (2-5)
        - Be appropriate for social media
        - Be 50-150 characters including hashtags
        Return only the caption, nothing else.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const caption = result.response.text();
        
        if (!caption) {
            throw new Error("Failed to generate caption");
        }

        return caption.trim();
    } catch (error) {
        console.error("AI Caption Generation Error:", error);
        throw new Error(`Failed to generate caption: ${error.message}`);
    }
}

/**
 * Generate multiple caption suggestions
 * @param {string} imageDescription - Description or tags for the image
 * @returns {Promise<Array<string>>} Array of caption suggestions
 */
async function generateCaptionSuggestions(imageDescription) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const prompt = `Generate 3 different creative and engaging Instagram captions for an image with the following description: "${imageDescription}". 
        Each caption should:
        - Be catchy and engaging
        - Include relevant hashtags (2-3)
        - Be appropriate for social media
        - Be unique and different from each other
        
        Format the response as a numbered list (1. Caption, 2. Caption, 3. Caption). Return only the captions, nothing else.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ text: prompt }],
        });

        const text = response.text;
        const captions = text
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line.length > 0);

        return captions;
    } catch (error) {
        console.error("AI Caption Suggestions Error:", error);
        throw new Error(`Failed to generate suggestions: ${error.message}`);
    }
}

/**
 * Generate hashtags for a post
 * @param {string} caption - The post caption
 * @returns {Promise<Array<string>>} Array of hashtags
 */
async function generateHashtags(caption) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const prompt = `Based on this Instagram caption, generate 10-15 relevant hashtags that would help increase visibility:
        "${caption}"
        
        Return only the hashtags separated by spaces, starting with # (e.g., #hashtag1 #hashtag2). No numbering or other text.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ text: prompt }],
        });

        const text = response.text;
        const hashtags = text
            .split(/\s+/)
            .filter(tag => tag.startsWith('#'))
            .map(tag => tag.toLowerCase());

        return hashtags;
    } catch (error) {
        console.error("AI Hashtags Generation Error:", error);
        throw new Error(`Failed to generate hashtags: ${error.message}`);
    }
}

module.exports = {
    generateCaption,
    generateCaptionSuggestions,
    generateHashtags
};