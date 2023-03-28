const router = require("express").Router();
const Project = require("../models/Project");
const User = require("../models/User");
const Review = require("../models/Review");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Gets profile view 
// @route   GET /profile
// @access  Private
router.get("/", async (req, res, next) => {
	// define userId
  try {
    // retrieve data from user model with user logged in ID
    // also retrieve user reviews and projects as for last route
  } catch (error) {
    console.error(error);
  }
});

// @desc    Edits profile data 
// @route   PUT /profile
// @access  Private
router.put("/", async (req, res, next) => {
  // define userId
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    company,
    industry,
    bio,
    status,
  } = req.body;
  if (!firstName || !lastName || !email || !password || !role || !company || !industry || ! bio || !status) {
    res.status(400).json({ message: 'Please fill all the fields in order to update your profile.' });
    return;
  }
  try {
    const response = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(204).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
  }
});

// @desc    Gets another user profile 
// @route   GET /profile/:userId
// @access  Private
router.get("/:userId", async (req, res, next) => {
	const {userId} = req.params;
  try {
    const otherUser = await User.findById(userId);
    const userReviews = await Review.find({personRated: userId});
    // queries for projects where the owner is the user and the ones where the user is in investors array - allows to retrieves projects for both investors and investees
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { investors: userId }],
    });
		res.status(200).json(otherUser, userReviews, userProjects);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;