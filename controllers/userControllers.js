// const asyncHandler = require("express-async-handler");
// const User = require("../model/userModel");
// const { json } = require("express");
// const generateToken = require("../config/generateToken");

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, pic } = req.body;

//   if (!name || !email || !password) {
//     res.status(400);
//     throw new Error("Please Enter all the Fields");
//   }
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists ");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     pic,
//   });

//   console.log(user);

//   // if (user) {
//   //   res.status(201),
//   //     json({
//   //       message: "user created successfully",
//   //       _id: user._id,
//   //       name: user.name,
//   //       email: user.email,
//   //       pic: user.pic,
//   //       token: generateToken(user._id),
//   //     });
//   // } else {
//   //   res.status(400);
//   //   throw new Error("Failed to Create the User");
//   // }
// });

// module.exports = { registerUser };
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({ name, email, password, pic });

  if (user) {
    res.status(201).json({
      message: "User created successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Failed to create the user" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        message: "User authenticated successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  // console.log(keyword);
  const userData = await User.find(keyword).find({
    _id: { $ne: req.user._id }, ///to not to select or find the current user(loggedIn User)
  });
  res.send(userData);
});

module.exports = { registerUser, authUser, allUsers };
