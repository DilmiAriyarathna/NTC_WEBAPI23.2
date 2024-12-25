const jwt = require('jsonwebtoken');

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

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.API_KEY); // Verify token
    console.log('Decoded Token:', decoded); // Log decoded token
    req.user = decoded; // Attach decoded token data to request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
