const Post = require('../models/post.model');
const User = require('../models/user.model');
const { generateCaption } = require('../service/ai.service');

/* =========================
   CREATE POST CONTROLLER
========================= */
async function createPostController(req, res) {
  try {
    const { caption, imageUrl, tags = [], aiGenerated = false, originalCaption = null } = req.body;
    const userId = req.user._id;

    // Validation
    if (!caption || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Caption and image URL are required"
      });
    }

    // Create post
    const post = await Post.create({
      caption,
      imageUrl,
      author: userId,
      tags: tags.map(tag => tag.toLowerCase().trim()),
      aiGenerated,
      originalCaption
    });

    // Populate author details
    await post.populate('author', 'username profileImage fullName');

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message
    });
  }
}

/* =========================
   GET ALL POSTS CONTROLLER
========================= */
async function getAllPostsController(req, res) {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username profileImage fullName')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage');

    const total = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message
    });
  }
}

/* =========================
   GET USER FEED CONTROLLER
========================= */
async function getUserFeedController(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    // Get current user's following list
    const user = await User.findById(userId);
    const followingIds = user.following;
    followingIds.push(userId); // Include own posts

    const posts = await Post.find({ author: { $in: followingIds } })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username profileImage fullName')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage');

    const total = await Post.countDocuments({ author: { $in: followingIds } });

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user feed error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching feed",
      error: error.message
    });
  }
}

/* =========================
   GET USER POSTS CONTROLLER
========================= */
async function getUserPostsController(req, res) {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId || userId === 'undefined') {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username profileImage fullName')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage');

    const total = await Post.countDocuments({ author: userId });

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user posts",
      error: error.message
    });
  }
}

/* =========================
   GET POST BY ID CONTROLLER
========================= */
async function getPostByIdController(req, res) {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate('author', 'username profileImage fullName')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message
    });
  }
}

/* =========================
   UPDATE POST CONTROLLER
========================= */
async function updatePostController(req, res) {
  try {
    const { postId } = req.params;
    const { caption, tags } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check authorization
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post"
      });
    }

    // Update post
    if (caption) post.caption = caption;
    if (tags) post.tags = tags.map(tag => tag.toLowerCase().trim());

    await post.save();
    await post.populate('author', 'username profileImage fullName');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username profileImage');

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message
    });
  }
}

/* =========================
   DELETE POST CONTROLLER
========================= */
async function deletePostController(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check authorization
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post"
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message
    });
  }
}

/* =========================
   LIKE POST CONTROLLER
========================= */
async function likePostController(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if already liked
    if (post.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already liked this post"
      });
    }

    // Add like
    post.likes.push(userId);
    await post.save();

    await post.populate('author', 'username profileImage fullName');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username profileImage');

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post
    });
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json({
      success: false,
      message: "Error liking post",
      error: error.message
    });
  }
}

/* =========================
   UNLIKE POST CONTROLLER
========================= */
async function unlikePostController(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if not liked
    if (!post.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You haven't liked this post"
      });
    }

    // Remove like
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    await post.save();

    await post.populate('author', 'username profileImage fullName');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username profileImage');

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post
    });
  } catch (error) {
    console.error('Unlike post error:', error);
    return res.status(500).json({
      success: false,
      message: "Error unliking post",
      error: error.message
    });
  }
}

/* =========================
   ADD COMMENT CONTROLLER
========================= */
async function addCommentController(req, res) {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Add comment
    post.comments.push({
      author: userId,
      text: text.trim()
    });

    await post.save();
    await post.populate('author', 'username profileImage fullName');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username profileImage');

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message
    });
  }
}

/* =========================
   DELETE COMMENT CONTROLLER
========================= */
async function deleteCommentController(req, res) {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Find the comment
    const comment = post.comments.find(c => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // Check authorization
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment"
      });
    }

    // Remove comment
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();

    await post.populate('author', 'username profileImage fullName');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username profileImage');

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      post
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message
    });
  }
}

/* =========================
   SEARCH POSTS BY TAGS CONTROLLER
========================= */
async function searchPostsByTagsController(req, res) {
  try {
    const { tag, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: "Tag is required"
      });
    }

    const posts = await Post.find({ tags: tag.toLowerCase() })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username profileImage fullName')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage');

    const total = await Post.countDocuments({ tags: tag.toLowerCase() });

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search posts error:', error);
    return res.status(500).json({
      success: false,
      message: "Error searching posts",
      error: error.message
    });
  }
}

module.exports = {
  createPostController,
  getAllPostsController,
  getUserFeedController,
  getUserPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
  likePostController,
  unlikePostController,
  addCommentController,
  deleteCommentController,
  searchPostsByTagsController
};
