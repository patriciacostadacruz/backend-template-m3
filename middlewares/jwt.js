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
  getToken: getTokenFromHeaders
});

const isAdmin = (req, res, next) => {
  if (req.payload.role === 'admin') {
    next()
  } else {
    res.status(401).json({ message: 'You are not admin and therefore cannot perform this task or access this route.'})
    return;
  }
}

module.exports = {
  isAuthenticated,
  isAdmin
};

