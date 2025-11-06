require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routes/AuthRoutes");
const resumeRoutes = require("./Routes/Resume");

const app = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your frontend port
  credentials: true
}));
app.use(express.json());

// Test routes
app.get("/hi", (req, res) => res.send("hi from GET"));
app.post("/hii", (req, res) => res.send("hi from POST"));

// Debug: check router types
console.log("typeof authRoutes:", typeof authRoutes); // should print "function"
console.log("typeof resumeRoutes:", typeof resumeRoutes); // should print "function"

// **Mount routers**
app.use("/api/Auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(port, () => console.log("Server running on port", port));
  })
  .catch(err => console.log("MongoDB error:", err));
