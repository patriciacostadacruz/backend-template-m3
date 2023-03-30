const router = require("express").Router();
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @desc    Shows all the messages in a specific conversation
// @route   GET /messages/:conversationId
// @access  Private
router.get("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate("messages")
      .populate("users")
      // recent messages shown last so that the conversation flow has last message at the bottom
      .sort({ "messages.createdAt": -1 }); ;
    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    next(error);
  }
});

// @desc    Sends a message in a conversation
// @route   POST /messages/:conversationId
// @access  Private
router.post("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  const { recipient, content } = req.body;
  const { _id: sender } = req.payload;
  try {
    const newMessage = await Message.create({ sender, recipient, content });
    const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: newMessage }}, { new: true }).populate("messages");
    res.status(201).json({ message: updatedConversation });
  } catch (error) {
    next(error);
  }
});

// @desc    Edits message
// @route   PUT /messages/:messageId
// @access  Private && Owner
router.put("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  const { recipient, content } = req.body;
  const { _id: sender } = req.payload;
  if (!sender || !recipient || !content) {
    res
      .status(400)
      .json({ message: "Please fill all the fields to update your message." });
    return;
  }
  try {
    const editedMessage = await Message.findByIdAndUpdate(messageId, { sender, recipient, content }, {
      new: true,
    });
    res.status(201).json({ message: editedMessage });
  } catch (error) {
    console.error(error);
  }
});

// @desc    Deletes a message
// @route   DELETE /messages/:messageId
// @access  Private && Owner
router.delete("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    res.status(201).json(deletedMessage);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
