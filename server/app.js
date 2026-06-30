const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config.json");

const lessonRoutes = require("./routes/lessons");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/lessons",
    express.static(path.resolve(config.lessonDirectory))
);

app.use("/api", lessonRoutes);

module.exports = app;