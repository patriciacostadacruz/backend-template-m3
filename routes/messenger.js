const router = require("express").Router();
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
// messages.js


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
  const { users } = req.body; // recipient
  // uno de los dos del payload
  try {
    const newConversation = await Conversation.create({ users });
    res.status(201).json({ conversation: newConversation });
  } catch (error) {
    next(error);
  }
});

// @desc    Shows all the messages in a specific conversation
// @route   GET /conversations/:conversationId
// @access  Private
router.get("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId).populate(
      "messages" // and users
    );
    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    next(error);
  }
});

// @desc    Sends a message in a conversation
// @route   POST /conversations/:conversationId
// @access  Private
router.post("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  const { sender, recipient, content } = req.body; // sender is user in payload
  try {
    const newMessage = await Message.create({ sender, recipient, content });
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push(newMessage._id);
    // keep this line for the message to be added in messages array in conversation document
    await conversation.save();
    res.status(201).json({ message: newMessage }); // return conversation with new:true AND populated
  } catch (error) {
    next(error);
  }
});

// @desc    Edits message
// @route   PUT /conversations/:messageId
// @access  Private
router.put("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  const { sender, recipient, content } = req.body; // sender is user in payload
  if (!sender || !recipient || !content) {
    res
      .status(400)
      .json({ message: "Please fill all the fields to update your message." });
    return;
  }
  try {
    const editedMessage = await Message.findByIdAndUpdate(messageId, req.body, {
      new: true,
    });
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
  // check that user in session is author of message to be deleted
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
  // check that user in session is author of message to be deleted
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(
      conversationId
    );
    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }
    await Message.deleteMany({ _id: { $in: deletedConversation.messages } });
    res
      .status(201)
      .json({ message: "Conversation and messages deleted successfully." });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
