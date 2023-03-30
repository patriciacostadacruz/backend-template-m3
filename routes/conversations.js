const router = require("express").Router();
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @desc    Shows all of user conversations
// @route   GET /conversations
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  try {
    const conversations = await Conversation.find({
      users: { $in: { _id: userId } },
    })
      .populate("users")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ "messages.createdAt": -1 }); 

    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
});

// @desc    Creates a new conversation
// @route   POST /conversations
// @access  Private
router.post("/", isAuthenticated, async (req, res, next) => {
  const { recipient } = req.body;
  const { _id: sender } = req.payload;
  try {
    const newConversation = await Conversation.create({ users: {recipient, sender} });
    res.status(201).json({ conversation: newConversation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
