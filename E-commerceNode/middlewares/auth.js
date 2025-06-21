const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { ...decoded, _id: decoded._id?.toString() };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
}

module.exports = auth;
