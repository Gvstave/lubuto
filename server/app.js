const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config.json");

const lessonRoutes = require("./routes/lessons");

const app = express();
const lessonDirectory = path.isAbsolute(config.lessonDirectory)
  ? config.lessonDirectory
  : path.resolve(__dirname, "..", config.lessonDirectory);

app.use(cors());
app.use(express.json());

app.use("/lessons", express.static(lessonDirectory));

app.use("/api", lessonRoutes);

app.use(express.static(path.resolve(__dirname, "dist")));

app.use((req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/lessons")) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

module.exports = app;
