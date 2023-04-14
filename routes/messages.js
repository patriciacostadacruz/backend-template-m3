const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @desc    Shows all the messages in a specific conversation
// @route   GET /messages/:conversationId
// @access  Private
router.get("/:conversationId", isAuthenticated, async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const conversationInDB = await Conversation.findById(conversationId);
    if (!conversationInDB) {
      res.status(400).json({ error: "This conversation doesn't exist." });
      return;
    }
    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } },
        populate: { path: "sender recipient", select: "firstName lastName image" },
      })
      .populate("users", "image");

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
  const { content } = req.body;
  const { _id: sender } = req.payload;
  try {
    const conversationInDB = await Conversation.findById(conversationId);
    if (!conversationInDB) {
      res.status(400).json({ error: "This conversation doesn't exist." });
      return;
    }
    const recipient = conversationInDB.users.find(
      (user) => String(user._id) !== String(sender)
    );
    if (!recipient) {
      res
        .status(400)
        .json({ error: "This conversation doesn't have a recipient." });
      return;
    } else {
      const conversationWithUsers = await Conversation.find({
        users: { $in: { _id: sender } },
      })
      if (!conversationWithUsers) {
        res
          .status(400)
          .json({
            error: "You are not allowed to send messages in this conversation.",
          });
        return;
      } else {
        const newMessage = await Message.create({ sender, recipient: recipient._id, content });
        const updatedConversation = await Conversation.findByIdAndUpdate(
          conversationId,
          { $push: { messages: newMessage._id } },
          { new: true }
        ).populate("messages").populate("users");
        res.status(201).json({ messageItem: updatedConversation });
      }
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Edits message
// @route   PUT /messages/:messageId
// @access  Private
router.put("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const { _id: sender } = req.payload;
  if (!sender || !content) {
    res
      .status(400)
      .json({ error: "Please fill all the fields to update your message." });
    return;
  }
  try {
    const editedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: content },
      {
        new: true,
      }
    );
    res.status(201).json({ messageItem: editedMessage });
  } catch (error) {
    console.error(error);
  }
});

// @desc    Deletes a message
// @route   DELETE /messages/:messageId
// @access  Private
router.delete("/:messageId", isAuthenticated, async (req, res, next) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    const conversation = await Conversation.findOneAndUpdate(
      { messages: messageId },
      { $pull: { messages: messageId } },
      { new: true }
    );
    res.status(201).json(deletedMessage);
  } catch (error) {
    console.error(error);
  }
});


module.exports = router;
