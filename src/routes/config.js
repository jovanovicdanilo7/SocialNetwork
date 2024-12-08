const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ apiUrl: process.env.API_BASE_URL + process.env.PORT + "/api" });
});

module.exports = router;
