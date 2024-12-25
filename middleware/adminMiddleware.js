// middleware/adminMiddleware.js
// const adminMiddleware = (req, res, next) => {
//     if (req.user.role !== 'Admin') {
//       return res.status(403).json({ message: 'Access denied. Admins only.' });
//     }
//     next();
//   };
  
//   module.exports = adminMiddleware;
  

  const adminMiddleware = (req, res, next) => {
    console.log('User Role:', req.user.role); // Log user role
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };
  
  module.exports = adminMiddleware;
  