// middleware/OperatorMiddlewaree.js
const OperatorMiddleware = (req, res, next) => {
    console.log('User Role:', req.user.role);
    if(req.user.role !== 'Operator') {
        return res.status(403).json({ message: 'Access denied. Operator Only.!'});
    }
    next();
};

module.exports = OperatorMiddleware;