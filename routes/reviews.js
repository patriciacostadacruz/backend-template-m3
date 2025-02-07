const router = require("express").Router();
const Review = require("../models/Review");
const { isAuthenticated } = require("../middlewares/jwt");

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
    !comment ||
    !personRating ||
    !personRated ) {
    res.status(400).json({ error: "Please fill all the fields to add a review." });
    return;
  }
  if (rating < 0 || rating > 5) {
    res.status(400).json({ error: "You must give a rate between 0 and 5."});
    return;
  }
  if (typeof title !== "string" || typeof comment !== "string") {
    res.status(400).json({ error: "Please add a valid title and comment." });
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