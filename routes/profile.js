const router = require("express").Router();
const Project = require("../models/Project");
const User = require("../models/User");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Gets profile view 
// @route   GET /profile
// @access  Private
router.get("/", async (req, res, next) => {
	// define userId
  try {
    // retrieve data from user model with user logged in ID
  } catch (error) {
    console.error(error);
  }
});

// @desc    Edits profile data 
// @route   PUT /profile
// @access  Private
router.put("/", async (req, res, next) => {
	// define userId
  try {
    const response = await User.findByIdAndUpdate(userId, req.body, {new: true});
		res.status(204).json({message: "Profile updated successfully."});
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
		res.status(200).json(otherUser);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;