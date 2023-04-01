const router = require('express').Router();
const Project = require("../models/Project");

// @desc    Home page
// @route   GET /
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find({ status: { $ne: "closed" } }).sort({ createdAt: -1 }).limit(3).populate("owner").populate("investors");
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

module.exports = router;