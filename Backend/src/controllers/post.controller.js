const postModel = require('../models/post.model');
const userModel = require('../models/user.model');

async function createPostController(req, res) {
    try {
        const file = req.file;
        const { caption } = req.body;
        const userId = req.user?._id || req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const newPost = new postModel({
            imageUrl: file ? file.path : null,
            caption,
            user: userId,
            likes: []
        });

        await newPost.save();
        await newPost.populate('user', 'username');

        return res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating post",
            error: error.message
        });
    }
}

async function getAllPostsController(req, res) {
    try {
        const posts = await postModel.find()
            .populate('user', 'username')
            .populate('likes', 'username')
            .sort({ createdAt: -1 });
        
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

async function getUserPostsController(req, res) {
    try {
        const userId = req.params.userId;
        
        const posts = await postModel.find({ user: userId })
            .populate('user', 'username')
            .populate('likes', 'username')
            .sort({ createdAt: -1 });
        
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

async function likePostController(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const post = await postModel.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userIdString = userId.toString();
        const isLiked = post.likes.some(id => id.toString() === userIdString);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userIdString);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        await post.populate('user', 'username');
        await post.populate('likes', 'username');

        return res.status(200).json({
            message: isLiked ? "Post unliked" : "Post liked",
            post: post,
            isLiked: !isLiked
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error liking post",
            error: error.message
        });
    }
}

module.exports = {
    createPostController,
    getAllPostsController,
    getUserPostsController,
    likePostController
}
