const router = require("express").Router();
const Review = require("../models/Review");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Creates a review
// @route   POST /reviews/new
// @access  Private
router.post("/new", async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;