const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Handles "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token format invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_EMP);

    if (decoded.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied: Employee only' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Employee auth error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
