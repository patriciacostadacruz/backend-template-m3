const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middlewares/jwt");

// @desc    Get all users
// @route   GET /users
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { industry, search } = req.query;
    if (industry) {
      const users = await User.find({
        $and: [
          { status: { $ne: "inactive" } },
          { role: { $ne: "admin" } },
          { industry: { $in: [industry] } },
        ],
      }).sort({ firstName: 1 });
      res.json({ users });
    }
    if (search) {
      const users = await User.find({
        $and: [
          { status: { $ne: "inactive" } },
          { role: { $ne: "admin" } },
          {
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
            ],
          },
        ],
      }).sort({ firstName: 1 });
      res.json({ users });
    }
    if (industry && search) {
      const users = await User.find({
        $and: [
          { status: { $ne: "inactive" } },
          { role: { $ne: "admin" } },
          { industry: { $in: [industry] } },
          {
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
            ],
          },
        ],
      }).sort({ firstName: 1 });
    } else {
      const users = await User.find({
        $and: [{ status: { $ne: "inactive" } }, { role: { $ne: "admin" } }],
      }).sort({ firstName: 1 });
      res.json({ users });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
