const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middlewares/jwt");

// @desc    Get all users
// @route   GET /users
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { industry, search } = req.query;
    const searchCriteria = { status: { $ne: "inactive"}, role: { $ne: "admin"} };
    if (search) {
      searchCriteria.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    if (industry) {
      searchCriteria.industry = { $in: industry.split(",") };
    }
    const users = await User.find(searchCriteria)
      .sort({ firstName: 1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
