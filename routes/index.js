const router = require('express').Router();
const Project = require("../models/Project");

// @desc    Home page
// @route   GET /
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.aggregate([
      { $match: { closed: false } },
      { $sample: { size: 3 } },
    ]);
    res.json(projects);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;