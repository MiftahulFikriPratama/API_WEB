const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwtSecret");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) {
      console.error("Error decoding token:", err);
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    console.log(decoded);
    next();
  });
}

module.exports = { authenticateToken };
