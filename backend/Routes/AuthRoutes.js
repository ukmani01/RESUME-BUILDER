const express = require("express");
const jwt = require("jsonwebtoken");
const newAuth = require("../models/auth");
const router = express.Router();

// Register
router.post("/Register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await newAuth.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const user = new newAuth({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Login
router.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await newAuth.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
