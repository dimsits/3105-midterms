const jwt = require('jsonwebtoken');
const JWT_SECRET = 'JWT-KEY'; // Use the same secret as in your login controller

module.exports = (req, res, next) => {
  // Correctly access the authorization header
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer ' || !token) {
    return res.status(400).send({ message: 'Invalid authorization header format.' });
  }

  try {
    // Verify token using the correct secret
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: user.id, username: user.username }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).send({ message: 'Token has expired.' });
    } else if (err.name === 'JsonWebTokenError') {
      res.status(401).send({ message: 'Invalid token.' });
    } else {
      res.status(500).send({ message: 'Internal server error.' });
    }
  }
};
