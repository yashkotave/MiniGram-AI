const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: [true, 'Caption is required'],
        maxlength: [2000, 'Caption cannot exceed 2000 characters'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    originalCaption: {
        type: String,
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    comments: [commentSchema],
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });

// Populate author by default on queries
postSchema.pre(/^find/, function(next) {
    if (this.options._recursed) {
        return next();
    }
    this.populate({
        path: 'author',
        select: 'username profileImage fullName'
    });
    this.populate({
        path: 'likes',
        select: 'username'
    });
    this.populate({
        path: 'comments.author',
        select: 'username profileImage'
    });
    this.options._recursed = true;
    next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;