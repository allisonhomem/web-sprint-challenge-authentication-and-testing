const { JWT_SECRET } = require("../secrets"); 
const jwt = require('jsonwebtoken');

// IMPLEMENT
// 1- On valid token in the Authorization header, call next.
// 2- On missing token in the Authorization header,
//   the response body should include a string exactly as follows: "token required".
// 3- On invalid or expired token in the Authorization header,
//   the response body should include a string exactly as follows: "token invalid".


const restricted = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({message: "token required"})
  }
  else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({message: "token invalid"})
      }
      else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  }
}

module.exports = restricted
