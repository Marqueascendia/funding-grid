const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyUser = (req, res, next) => {

    let token;
  
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    } 

    if (!token) {
      return res.status(401).json({ error: "Access denied. Not authorized" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) { // `exp` is in seconds; convert to ms
        return res.status(401).json({ error: "Token expired. Please log in again." });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(400).json({ error: "Invalid token." });
    }
  };

module.exports = {
    verifyUser
}