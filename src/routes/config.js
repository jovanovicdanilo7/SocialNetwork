const express = require("express");
const router = express.Router();
const PORT = process.env.PORT || 5000;

router.get("/", (req, res) => {
    res.json({ apiUrl: process.env.API_BASE_URL + PORT + "/api" });
});

module.exports = router;
