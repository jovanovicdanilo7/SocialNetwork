const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    commentContent: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("comment", CommentSchema);
