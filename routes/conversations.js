const router = require("express").Router();
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @desc    Shows all of user conversations
// @route   GET /conversations
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;
  try {
    const conversations = await Conversation.find({ users: _id }); // _id in users
    // decide if you sort conversations and how
    // populate users and conversation
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

// @desc    Deletes a conversation
// @route   DELETE /conversations/:conversationId
// @access  Private && Owner
router.delete("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  // check that user in session is author of message to be deleted
  try {
    const conversation = await Conversation.findById(conversationId);
    await Message.deleteMany({ _id: { $in: conversation.messages } });
		await Conversation.findByIdAndDelete(conversationId);
    res
      .status(201)
      .json({ message: "Conversation deleted successfully." });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
