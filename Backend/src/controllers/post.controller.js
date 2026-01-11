const postModel = require('../models/post.model');

async function createPostController(req, res) {
    const file = req.file;
    console.log("File received in controller:", file);

}

module.exports = {
    createPostController
}
