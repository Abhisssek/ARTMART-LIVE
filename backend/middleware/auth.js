const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

exports.isAuthenticatedUser = async (req, res, next) => {
  const  token  = req.cookies.token;
  // console.log(token);
  

  if (!token) {
    return res.status(401).json({ message: "Login first to access this resource" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token, please login again" });
  }
};

// Role-based access control
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
