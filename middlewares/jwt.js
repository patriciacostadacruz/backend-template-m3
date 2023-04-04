const { expressjwt: jwt } = require('express-jwt');
const Project = require("../models/Project");
const Message = require("../models/Message");

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request headers
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") { // Ejemplo: Bearer kdjekdncewnoeiñfewf
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders//token
});

const isAdmin = (req, res, next) => {
  if (req.payload.role === 'admin') {
    next()
  } else {
    res.status(401).json({ message: 'You are not admin and therefore cannot perform this task or access this route.'})
    return;
  }
}

const isOwnerOrSender = async (req, res, next) => {
  try {
    const { projectId, messageId } = req.params;
    let ownerOrSender;
    // Check if deleting a project or a message
    if (projectId) {
      const project = await Project.findById(projectId);
      ownerOrSender = project.owner.equals(req.user._id);
    } else if (messageId) {
      const message = await Message.findById(messageId);
      ownerOrSender = message.sender.equals(req.user._id);
    }
    if (!ownerOrSender) {
      res.status(401).json({ message: "You cannot delete this item." });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isOwnerOrSender,
};

