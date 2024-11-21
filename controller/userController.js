const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


// Register User
exports.register = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
         return res.status(400).json({ success: false, message: "All fields are required!" });
      }

      // Check if email already exists
      const userfind = await User.findOne({ email });
      if (userfind) {
         return res.status(400).json({ success: false, message: "Email is already registered!" });
      }

      // Create new user
      const user = await User.create({ name, email, password });

      // Exclude password from response
      user.password = undefined;

      res.status(201).json({ success: true, user });
   } catch (error) {
      console.error("Error in Registration:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


// Login User
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
         return res.status(400).json({ success: false, message: "Email and password are required!" });
      }

      // Find user by email and include password in query
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
         return res.status(400).json({ success: false, message: "Invalid email or password!" });
      }

      // Compare passwords
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
         return res.status(400).json({ success: false, message: "Invalid password" });
      }

      // Generate JWT Token
      const token = await user.generateToken();

      // Exclude password from response
      user.password = undefined;

      res.status(200).json({
         success: true,
         message: "Login successful",
         token,
         user,
      });
   } catch (error) {
      console.error("Error in Login:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


// Get User Data (Authenticated)
exports.getUserData = async (req, res) => {
   try {
      const { token } = req.body;

      // Verify JWT token
      const { id } = jwt.verify(token, process.env.SECRET);

      // Find user by ID
      const user = await User.findOne({ _id: id });
      if (user) {
         res.status(200).json({ success: true, user });
      } else {
         res.status(400).json({ success: false, message: "User not found" });
      }
   } catch (error) {
      console.error("Error in Fetching User Data:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};
