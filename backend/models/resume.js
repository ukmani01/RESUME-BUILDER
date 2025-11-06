const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "newAuth", required: true },
  photo: { type: String, default: "" },
  personal: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    summary: { type: String, default: "" },
    link: {
      label: { type: String, default: "" },
      url: { type: String, default: "" }
    }
  },
  languages: { type: [String], default: [] },
  education: [
    { school: String, degree: String, startYear: String, endYear: String, grade: String }
  ],
  skills: { type: [String], default: [] },
  projects: [{ title: String, desc: String, tech: String }],
  experience: [{ company: String, role: String, start: String, end: String, desc: String }],
  certifications: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Resume", ResumeSchema);
