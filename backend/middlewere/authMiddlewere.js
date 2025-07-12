const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middlewere to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select("-password"); //Exclude the password
      next();
    } catch (error) {
      console.error("Token veryfication failed", error);
      res.status(401).json({ msg: "Not Authorized , Token failed" });
    }
  } else {
    res.status(401).json({ msg: "Not Authorized , No token provided" });
  }
};
// Middlewere to check if user is admin 
const admin = (req , res , next)=>{
  if(req.user && req.user.role === "admin"){
    next();
  }else{
    res.status(403).json({msg : "You are not authorized as admin"})
  }
}

module.exports = { protect , admin };
