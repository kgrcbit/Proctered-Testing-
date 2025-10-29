const express = require("express");
const Exam = require("../models/Exam");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create exam (faculty only)
router.post("/", auth, auth.requireRole("faculty"), async (req, res) => {
  try {
    const payload = req.body || {};
    const doc = new Exam({ ...payload, createdBy: req.user.id });
    await doc.validate();
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List my exams (faculty)
router.get("/", auth, auth.requireRole("faculty"), async (req, res) => {
  try {
    const list = await Exam.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get exam by id (faculty owned)
router.get("/:id", auth, auth.requireRole("faculty"), async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    return res.json(exam);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update exam (faculty owner)
router.put("/:id", auth, auth.requireRole("faculty"), async (req, res) => {
  try {
    const update = req.body || {};
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    Object.assign(exam, update);
    await exam.validate();
    await exam.save();

    return res.json(exam);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete exam (faculty owner)
router.delete("/:id", auth, auth.requireRole("faculty"), async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    return res.json({ message: "Exam deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
