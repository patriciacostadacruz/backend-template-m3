const router = require("express").Router();
const Users = require("../models/User");

// @desc    Get all users
// @route   GET /users
// @access  Private
router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find({ status: { $ne: "inactive" }, role: { $ne: "admin"} }).sort({ firstName: 1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
