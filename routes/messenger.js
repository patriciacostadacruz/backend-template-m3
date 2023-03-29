const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @desc    Shows all of user conversations 
// @route   GET /conversations
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
	const { _id } = req.payload;
	try {
		const conversations = await Conversation.find({ users: _id});
		res.status(200).json({conversations});
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

// @desc    Creates a new conversation
// @route   POST /conversations/new
// @access  Private
router.post("/new", isAuthenticated, async (req, res, next) => {
	const { users } = req.body;
  try {
    const newConversation = await Conversation.create({ users });
    res.status(201).json({ conversation: newConversation });
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
    conversation.messages.push(newMessage);
    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;