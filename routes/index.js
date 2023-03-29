const router = require('express').Router();
const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Home page
// @route   GET /
// @access  Public
router.get("/", async (req, res, next) => {
  const currentUser = req.payload;
  console.log(currentUser);
  try {
    const industryProjects = await Project.aggregate([
      { $match: { industry: currentUser.industry, status: { $ne: "closed" } } },
      { $sample: { size: 3 } },
    ]);
    const randomUsers = await User.aggregate([
      { $match: { industry: currentUser.industry } },
      { $sample: { size: 3 } },
    ]);
    res.json({ projects: industryProjects, users: randomUsers });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;