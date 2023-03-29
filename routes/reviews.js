const router = require("express").Router();
const Review = require("../models/Review");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Creates a review
// @route   POST /reviews/new
// @access  Private
router.post("/new", isAuthenticated, async (req, res, next) => {
  const {
    title,
    rating,
    comment,
    personRating,
    personRated
  } = req.body;
  if (
    !title ||
    !rating ||
    !comment ||
    !personRating ||
    !personRated ) {
    res.status(400).json({ message: "Please fill all the fields to add a review." });
    return;
  }
  if (rating < 0 || rating > 5) {
    res.status(400).json({ message: "You must give a rate between 0 and 5."});
  }
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;