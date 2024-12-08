const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email)
            return res.status(400).json({ error: "Username and email are required" });

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email && existingUser.username === username)
                return res.status(409).json({ message: "Email and username already exist." });
            if (existingUser.email === email)
                return res.status(409).json({ message: "Email already exists, please try another." });
            if (existingUser.username === username)
                return res.status(409).json({ message: "Username already exists, please try another." });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error("Error occurred while registration:", error);
        res.status(500).json({ message: "An error occurred during registration." });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ error: "User not found." });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error while finding user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/login/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (user)
            return res.status(200).json({ message: "User found. Proceed to login.", user });
        else
            return res.status(404).json({ message: "User with this email does not exist." });
    } catch (error) {
        console.error("Error while finding user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/edit/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { username, email } = req.body;

        if (!username || !email)
            return res.status(400).json({ error: "Username and email are required" });

        const updatedUser = await User.findByIdAndUpdate(
            sessionId,
            { username, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser)
            return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error while editing user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/delete/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;
        const deletedUser = await User.findByIdAndDelete(sessionId);

        if (!deletedUser)
            return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error while deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
