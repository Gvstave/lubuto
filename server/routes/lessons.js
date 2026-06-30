const express = require("express");
const router = express.Router();

const scanLessons = require("../services/scanLesson");

router.get("/tree", (req, res) => {

    const tree = scanLessons();

    res.json(tree);

});

module.exports = router;