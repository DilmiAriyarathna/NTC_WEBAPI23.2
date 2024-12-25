// controllers/UserController.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

// Register User
exports.registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
     // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'ERROR! User already exists' });

    const user = await User.create({ name, email, password, role });

    if (user) {
        res.status(201).json({
          message: "User registered successfully",
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Add role to the response
        });
      }
       else {
      res.status(400).json({ message: 'ERROR! Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //find user by email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

        //generate JWT Token 
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role, // Include the user's role
          },
            process.env.API_KEY,             // Secret key
            { expiresIn: '10d' }                 // Token expiration
          );

      res.json({
        message: "SUCCESSFULLY! Login successfully",
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'ERROR! Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// Controller to get the logged-in user's profile
exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // Use req.user.id populated by middleware
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's profile
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
