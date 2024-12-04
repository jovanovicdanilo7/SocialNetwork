const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { commentContent } = req.body;

        if (!commentContent || commentContent.trim() === "")
            return res.status(400).json({ error: "Content of the comment is required" });

        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).send(comment);
    } catch (error) {
        console.error("Error occurred while comment creation:", error);
        res.status(500).json({ error: "An error occurred during comment creation." });
    }
});

router.delete("/delete-by-user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        await Comment.deleteMany({ userId });

        res.status(200).json({
            message: "Comments delted successfully"
        });
    } catch (error) {
        console.error("Error while deleting user's comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
