const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // Import your User model

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.API_KEY); // Verify token
//     req.user = decoded; // Attach decoded token data to request object
//     next();
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };


// const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.API_KEY); // Verify token
    console.log('Decoded Token:', decoded); // Log decoded token

  // Fetch operator information from the database
  const user = await User.findById(decoded.id); // Assuming `id` is in the token payload
  if (!user) {
    return res.status(401).json({ message: 'User not found or unauthorized.' });
  }

  req.user = {
    id: user._id,
    name: user.name, // Assuming the user's name column is `name`
    role: user.role, // Assuming the user's role column is `role`
  };
    // req.user = decoded; // Attach decoded token data to request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
