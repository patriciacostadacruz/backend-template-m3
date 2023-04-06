const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt");
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
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: { path: "sender", select: "firstName lastName" },
      })
      .sort({ "messages.createdAt": -1 }); 

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
});

// @desc    Creates a new conversation
// @route   POST /conversations/:recipientId
// @access  Private
// @desc    Creates a new conversation
// @route   POST /conversations/:recipientId
// @access  Private
router.post("/:recipientId", isAuthenticated, async (req, res, next) => {
  const { recipientId } = req.params;
  const { _id: sender } = req.payload;
  try {
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.status === "inactive") {
      res
        .status(400)
        .json({ error: "The recipient is inactive or does not exist." });
      return;
    }
    const senderUser = await User.findById(sender);
    if (!senderUser || senderUser.status === "inactive") {
      res
        .status(400)
        .json({
          error:
            "Your account is inactive or does not exist. If you want to enable your account, please log in.",
        });
      return;
    }
    const existingConversation = await Conversation.findOne({
      users: { $all: [sender, recipientId] },
    });
    if (existingConversation) {
      res.status(400).json(existingConversation);
      return;
    } else {
      const newConversation = await Conversation.create({
        users: [recipientId, sender],
      });
      res.status(201).json({ conversation: newConversation });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
