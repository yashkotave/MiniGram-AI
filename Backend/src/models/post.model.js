const mongooose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        caption: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    }
})

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;