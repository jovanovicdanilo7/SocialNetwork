const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.post("/create", async (req, res) => {
    try {
        const { postContent } = req.body;

        if (!postContent)
            return res.status(400).json({ error: "Content of the post is required" });

        const post = new Post(req.body);
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        console.error("Error occurred while post creation:", error);
        res.status(500).json({ error: "An error occurred during post creation." });
    }
});

router.get("/all", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error while fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/delete/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost)
            return res.status(404).json({ error: "Post not found" });

        res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
    } catch (error) {
        console.error("Error while deleting post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/delete-by-user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        await Post.deleteMany({ userId });

        res.status(200).json({
            message: "Posts delted successfully"
        });
    } catch (error) {
        console.error("Error while deleting user's posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/like/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const { likes, listOfLikes } = req.body;

        if (likes < 0)
            return res.status(400).json({ error: "Number of likes must br non negative" });

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { likes, listOfLikes },
            { new: true, runValidators: true }
        );

        if (!updatedPost)
            return res.status(404).json({ error: "Post not found" });

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error("Error while liking post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        res.status(200).json(post);
    } catch (error) {
        console.error("Error while fetching post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
