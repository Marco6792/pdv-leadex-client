import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    res.status(401);
    throw new Error("All fields required!")
  }

  const userExist = await User.findOne({ email, username });

  //check if user exit and throw and error
  if (userExist) {
    res.status(401);
    throw new Error(`user already exit`)
  }

  //hash the user password
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  //   console.log({username, password});
  //   res.json({ message: "register user" });
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // const findPassword = await User.findOne(user.password)

  // const matchpassword = await bcrypt.compare(findPassword, password)

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password!")
  }
});

// const logInUser = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;
//   res.json({ message: "login user" });
// });

const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.json({ message: "get user profile" });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    // user.password = req.body.password || user.password
    if (req.body.password) {
    user.password = req.body.password;
    }
   const updatedUser=  await user.save()
   res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email
   })
  } else {
    res.status(404).json({ message: "please try again later" });
  }
  res.json({ message: "update" });
});

export {
  authUser,
  registerUser,
  //   logInUser,
  logOutUser,
  updateUserProfile,
  getUserProfile,
};
