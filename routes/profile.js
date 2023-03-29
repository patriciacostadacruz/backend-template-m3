const router = require("express").Router();
const Project = require("../models/Project");
const User = require("../models/User");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Gets profile view 
// @route   GET /profile
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
	const { _id } = req.payload;
  console.log(req.payload)
  try {
    const user = await User.findById(_id);
    const userReviews = await Review.find({ personRated: _id });
    // maybe separate projects owned and projects worked on as investors - TBD later
    const userProjects = await Project.find({
      $or: [{ owner: _id }, { investors: _id }],
    });
    res.status(200).json({user, userReviews, userProjects});
  } catch (error) {
    console.error(error);
  }
});

// @desc    Edits profile data 
// @route   PUT /profile
// @access  Private
router.put("/", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  const {
    firstName,
    lastName,
    email,
    role,
    company,
    industry,
    bio,
    status,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !role ||
    !company ||
    !industry ||
    !bio ||
    !status
  ) {
    res
      .status(400)
      .json({
        message: "Please fill all the fields in order to update your profile.",
      });
    return;
  }
  try {
    await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(204).json({ message: "Profile updated successfully." });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

// @desc    Edits password 
// @route   PUT /profile/password-edit
// @access  Private
router.put("/password-edit", isAuthenticated, async (req, res, next) => {
  console.lof(req.payload);
  const { _id: userId, hashedPassword } = req.payload;
  const { oldPassword, password, passwordConfirmation } = req.body;
  if (!oldPassword || !password || !passwordConfirmation) {
    res.status(400).json({
      message: "Please write your new password.",
    });
    return;
  }
  const match = await bcrypt.compare(oldPassword, hashedPassword);
  if (!match) {
    res.status(400).json({message: "Your old password doesn't match."});
  }
  if (password !== passwordConfirmation) {
    res.status(400).json({
      message:
        "Confirmation password doesn't match the new one chosen.",
    });
    return;
  }
  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res
      .status(400)
      .json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
    return;
  }
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedNewPassword = bcrypt.hashSync(password, salt);
    await User.findByIdAndUpdate(
      userId,
      { hashedPassword: hashedNewPassword },
      {
        new: true,
      }
    );
    res.status(204).json({ message: "Password updated successfully." });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

// @desc    Gets another user profile 
// @route   GET /profile/:userId
// @access  Private
router.get("/:userId", isAuthenticated, async (req, res, next) => {
	const {userId} = req.params;
  try {
    const otherUser = await User.findById(userId);
    const userReviews = await Review.find({personRated: userId});
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { investors: userId }],
    });
		res.status(200).json({otherUser, userReviews, userProjects});
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;