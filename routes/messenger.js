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
    const conversations = await Conversation.find({ users: _id });
    res.status(200).json({ conversations });
  } catch (error) {
    console.log(error);
  }
});

// @desc    Creates a new conversation
// @route   POST /conversations
// @access  Private
router.post("/", isAuthenticated, async (req, res, next) => {
  const { users } = req.body;
  try {
    const newConversation = await Conversation.create({ users });
    res.status(201).json({ conversation: newConversation });
  } catch (error) {
    console.log(error);
  }
});

// @desc    Shows all the messages in a specific conversation
// @route   GET /conversations/:conversationId
// @access  Private
router.get("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId).populate(
      "messages"
    );
    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.log(error);
  }
});

// @desc    Sends a message in a conversation
// @route   POST /conversations/:conversationId
// @access  Private
router.post("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  const { sender, recipient, content } = req.body;
  try {
    const newMessage = await Message.create({ sender, recipient, content });
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push(newMessage._id);
    // keep this line for the message to be added in messages array in conversation document
    await conversation.save();
    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.log(error);
  }
});

// @desc    Edits message
// @route   PUT /conversations/:messageId
// @access  Private
router.put("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  const { sender, recipient, content } = req.body;
  if (!sender || !recipient || !content) {
    res.status(400).json({ message: "Please fill all the fields to update your message."});
    return;
  }
  try {
     const editedMessage = await Message.findByIdAndUpdate(messageId, req.body, {new: true});
     res.status(201).json({ message: editedMessage });
  } catch (error) {
    console.error(error);
  }
});

// @desc    Deletes a message
// @route   DELETE /conversations/:messageId
// @access  Private
router.delete("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    res.status(201).json(deletedMessage);
  } catch (error) {
    console.error(error);
  }
});

// @desc    Deletes a conversation
// @route   DELETE /conversations/:conversationId
// @access  Private
router.delete("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ _id: { $in: deletedConversation.messages } });
    res.status(201).json({ message: "Conversation deleted successfully." });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
