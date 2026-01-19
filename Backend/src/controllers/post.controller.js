const postModel = require('../models/post.model');

async function createPostController(req, res) {
    const file = req.file;
    console.log("File received in controller:", file);

}

async function getUserPostsController(req, res) {
    try {
        const userId = req.params.userId;
        
        const posts = await postModel.find({ userId }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            message: "Posts fetched successfully",
            posts: posts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching posts",
            error: error.message
        });
    }
}

module.exports = {
    createPostController,
    getUserPostsController
}
