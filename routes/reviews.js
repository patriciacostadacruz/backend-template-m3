const router = require("express").Router();
const Review = require("../models/Review");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
// remove unused middles (if there are)

// @desc    Creates a review
// @route   POST /reviews/new
// @access  Private
router.post("/new", isAuthenticated, async (req, res, next) => {
  const {
    title,
    rating,
    comment,
    personRated
  } = req.body;
  const { _id: personRating } = req.payload;
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
  if (comment !== String || title !== String) {
    res.status(400).json({ message: "Please add a valid title and comment."});
    return;
  }
  try {
    const newReview = await Review.create({ title, rating, comment, personRating, personRated});
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

module.exports = router;