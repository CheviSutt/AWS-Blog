
const jsonWebToken = require("jsonwebtoken");

module.exports = (req, res, next) => { // Typical looking middleware in express, its a function
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonWebToken.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({message: "You have failed to authenticate!"});
  }
};


