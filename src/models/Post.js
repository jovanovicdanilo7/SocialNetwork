const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    postContent: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
        required: true,
    },
    listOfLikes: {
        type: Map,
        of: Boolean,
        default: new Map(),
        required: true,
    },
});

module.exports = mongoose.model("post", PostSchema);