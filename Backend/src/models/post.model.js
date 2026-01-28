const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },
    caption: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;