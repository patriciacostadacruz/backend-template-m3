const router = require("express").Router();
const Project = require("../models/Project");
const User = require("../models/User");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { isAuthenticated } = require("../middlewares/jwt");
// const cloudinary = require("../config/cloudinary.config");

// @desc    Gets profile view 
// @route   GET /profile
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
	const { _id } = req.payload;
  try {
    const user = await User.findById(_id);
    const userReviews = await Review.find({ personRated: _id }).populate("personRated").populate("personRating");
    const userProjects = await Project.find({
      $or: [{ owner: _id }, { investors: _id }],
    }).populate("owner").populate("investors");
    res.status(200).json({user, userReviews, userProjects});
  } catch (error) {
    next(error);
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
    image,
    email,
    role,
    company,
    industry,
    bio,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !image ||
    !role ||
    !company ||
    industry.length < 1 ||
    !bio
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
    const payload = {
      firstName: firstName,
      lastName: lastName,
      image: image,
      email: email,
      hashedPassword: req.payload.hashedPassword,
      role: role,
      linkedIn: req.payload.linkedIn,
      company: company,
      industry: industry,
      bio: bio,
      status: req.payload.status,
      _id: req.payload._id,
    };
    // Use the jwt middleware to create the new token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    res
      .status(204)
      .json({ message: "Profile updated successfully.", authToken });
  } catch (error) {
    next(error);
  }
});

// @desc    Edits password 
// @route   PUT /profile/password-edit
// @access  Private
router.put("/password-edit", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  const { oldPassword, password, passwordConfirmation } = req.body;
  if (!oldPassword || !password || !passwordConfirmation) {
    res.status(400).json({
      message: "Please write your new password.",
    });
    return;
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }
  const match = await bcrypt.compare(oldPassword, user.hashedPassword);
  if (!match) {
    res.status(400).json({message: "Your old password doesn't match."});
    return;
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
    const payload = {
      firstName: req.payloadfirstName,
      lastName: req.payloadlastName,
      image: req.payload.image,
      email: req.payload.email,
      hashedPassword: hashedNewPassword,
      role: req.payload.vrole,
      linkedIn: req.payload.linkedIn,
      company: req.payload.company,
      industry: req.payload.industry,
      bio: req.payload.bio,
      status: req.payload.status,
      _id: req.payload._id,
    };
    // Use the jwt middleware to create the new token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    res.status(204).json({ message: "Password updated successfully.", authToken });
  } catch (error) {
    next(error);
  }
});

// @desc    Enable/disables account 
// @route   PUT /profile/status-update
// @access  Private
router.put("/status-update", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  try {
    if (typeof req.body.status === "string" && req.body.status.length < 1) {
      res.status(400).json({message: "You need to choose the status of your account: active or inactive."});
      return;
    }
    if (req.body.status !== "active" && req.body.status !== "inactive") {
      res
        .status(400)
        .json({
          message:
            "The status can only be active or inactive.",
        });
      return;
    } else {
      await User.findByIdAndUpdate(
        userId,
        { status: req.body.status },
        { new: true }
      );
      const payload = {
        firstName: req.payloadfirstName,
        lastName: req.payloadlastName,
        image: req.payload.image,
        email: req.payload.email,
        hashedPassword: req.payload.hashedPassword,
        role: req.payload.vrole,
        linkedIn: req.payload.linkedIn,
        company: req.payload.company,
        industry: req.payload.industry,
        bio: req.payload.bio,
        status: req.body.status,
        _id: req.payload._id,
      };
      // Use the jwt middleware to create the new token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "30d",
      });
      res.status(204).json({ message: "Account status updated successfully.", authToken });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Change profile pic 
// @route   PUT /profile/edit-picture
// @access  Private
router.put("/edit-picture", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  const { image } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {image}, {new: true});
    const payload = {
      firstName: req.payloadfirstName,
      lastName: req.payloadlastName,
      image: req.body,
      email: req.payload.email,
      hashedPassword: req.payload.hashedPassword,
      role: req.payload.vrole,
      linkedIn: req.payload.linkedIn,
      company: req.payload.company,
      industry: req.payload.industry,
      bio: req.payload.bio,
      status: req.payload.status,
      _id: req.payload._id,
    };
    // Use the jwt middleware to create the new token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    res.status(204).json({ message: "You successfully changed your profile picture.", authToken })
  } catch (error) {
    next(error);
  }
});

// @desc    Gets another user profile 
// @route   GET /profile/:userId
// @access  Private
router.get("/:userId", isAuthenticated, async (req, res, next) => {
	const {userId} = req.params;
  const myId = req.payload._id;
  try {
    if (myId === userId) {
      res.redirect("/profile");
    } else {
      const otherUser = await User.findById(userId);
      if (otherUser.status === "inactive") {
        res.status(400).json({ message: "You cannot access this user's profile, it has been disabled." });
        return;
      } else {
        const userReviews = await Review.find({ personRated: userId })
          .populate("personRated")
          .populate("personRating");
        const userProjects = await Project.find({
          $or: [{ owner: userId }, { investors: userId }],
        }).populate("owner").populate("investors");
        res.status(200).json({otherUser, userReviews, userProjects});
        }
      }
  } catch (error) {
    next(error);
  }
});

module.exports = router;