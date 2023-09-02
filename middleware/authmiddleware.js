import jwt from "jsonwebtoken";
import asycnHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asycnHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");
      
      next()
    } catch (error) {
      res.status(401).json({err: error.message});
    }
  } else {
    res.status(401).json({message: "Cannot access this route try registering first"});
  }
});

export { protect };
