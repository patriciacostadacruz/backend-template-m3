const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require('../middlewares/jwt');
// const cloudinary = require("../config/cloudinary.config");

// @desc    SIGN UP new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const {
    firstName,
    lastName,
    image,
    email,
    password,
    passwordConfirmation,
    role,
    linkedIn,
    company,
    industry,
    bio,
    status } = req.body; 
  if (!firstName || !lastName || !image || !email || !password || !passwordConfirmation || !role || industry.length < 1 || !company || ! bio || !status) {
    res.status(400).json({ message: 'Please fill all the fields to sign up.' });
    return;
  }
  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Not a valid email format.' });
    return;
  }
  if (password !== passwordConfirmation) {
    res.status(400).json({
      message: "Confirmation password doesn't match.",
    });
    return;
  }
   // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  try {
    const userInDB = await User.findOne({ email });
    if (userInDB) {
      res.status(400).json({ message: `User already exists with email ${email}` });
      return;
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        firstName,
        lastName,
        image,
        email,
        hashedPassword,
        role,
        linkedIn,
        company,
        industry,
        bio,
        status,
      });
      res.status(201).json({ data: newUser });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    LOG IN user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => { 
  console.log(req.headers);
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ message: 'Please fill all the fields to login.' });
    return;
  }
  try {
    const userInDB = await User.findOne({ email });
    if (!userInDB) {
      res.status(404).json({ success: false, message: `No user registered by email ${email}` })
      return;
    } else {
      const passwordMatches = bcrypt.compareSync(password, userInDB.hashedPassword);
      if (passwordMatches) {
        // Let's create what we want to store in the jwt token
        const payload = {
          firstName: userInDB.firstName,
          lastName: userInDB.lastName,
          image: userInDB.image,
          email: userInDB.email,
          hashedPassword: userInDB.hashedPassword,
          role: userInDB.role,
          linkedIn: userInDB.linkedIn,
          company: userInDB.company,
          industry: userInDB.industry,
          bio: userInDB.bio,
          status: userInDB.status,
          _id: userInDB._id,
        };
        // Use the jwt middleware to create de token
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "30d" }
        );
        res.status(200).json({ authToken: authToken })
      } else {
        res.status(401).json({ success: false, message: 'Unable to authenticate user.'})
      }
    }
  } catch (error) {
    next(error)
  }
});

// @desc    GET logged in user
// @route   GET /auth/me
// @access  Private
router.get('/me', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log('Whose token is on the request:', req.payload);
  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
})

module.exports = router;