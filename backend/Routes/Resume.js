const express = require("express");
const jwt = require("jsonwebtoken");
const Resume = require("../models/resume");
const router = express.Router();
const getPDFBuffer = require("./pdfGenerator")

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No auth" });

  const token = header.split(" ")[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Create / Update Resume
router.post("/", auth, async (req, res) => {
  try {
    const payload = { user: req.user.id, ...req.body };
    let resume = await Resume.findOne({ user: req.user.id });

    if (resume) {
      Object.assign(resume, req.body);
      await resume.save();
    } else {
      resume = await Resume.create(payload);
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Resume
router.get("/", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    res.json(resume || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/download", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const pdfBuffer = await getPDFBuffer(resume);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${resume.personal.name || "resume"}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
