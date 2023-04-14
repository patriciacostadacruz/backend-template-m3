const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt");
const Conversation = require("../models/Conversation");
// @desc    Get one conversation
// @route   GET /conversations
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  try {
    const conversations = await Conversation.find({
      users: { $in: [userId] },
    })
      .populate({
        path: "users",
        select: "firstName lastName image",
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "sender recipient",
          select: "firstName lastName image",
        },
      })
      .sort({ "messages.createdAt": -1 });
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
});

// @desc    Shows all of user conversations
// @route   GET /conversations
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  try {
    const conversations = await Conversation.find({
      users: { $in: [userId] },
    })
      .populate({
        path: "users",
        select: "firstName lastName image",
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "sender recipient",
          select: "firstName lastName image",
        },
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
router.post("/:recipientId", isAuthenticated, async (req, res, next) => {
  const { recipientId } = req.params;
  const { _id: sender } = req.payload;
  try {
    const existingConversation = await Conversation.findOne({
      users: { $all: [sender, recipientId] },
    });
    if (existingConversation) {
      res.json(existingConversation);
      return;
    } else {
      const newConversation = await Conversation.create({
        users: [recipientId, sender],
      });
      res.status(201).json(newConversation);
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;
