const path = require("path");
const express = require("express");
require("./config/db");

const userRoutes = require("./routes/user");
const configRoutes = require("./routes/config");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comments");

const app = express();
app.use(express.json());

app.use("/api/config", configRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/edit.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/Edit/edit.html"));
});

app.get("/hexa.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/Main/hexa.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
