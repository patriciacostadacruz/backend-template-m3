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
// @route   POST /conversations/:recipientId
// @access  Private
router.post("/:recipientId", isAuthenticated, async (req, res, next) => {
  const { recipientId } = req.params;
  const { _id: sender } = req.payload;
  try {
    const existingConversation = await Conversation.findOne({
      users: { $all: [sender, recipientId] },
    });
    if (existingConversation) {
      res.status(400).json({ message: "You already have a conversation with this user." });
      return;
    }
    const newConversation = await Conversation.create({
      users: [ recipientId, sender ],
    });
    res.status(201).json({ conversation: newConversation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
