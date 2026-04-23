const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const Student = require("../models/Student");

const router = express.Router();

const createJwtToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

const buildUserResponse = async (user) => {
  const token = createJwtToken({ id: user._id, role: user.role, model: "User" });
  let enriched = {
    id: user._id,
    name: user.name,
    email: user.email,
    rollno: user.rollno,
    role: user.role,
  };
  if (user.role === "student") {
    const roster = await Student.findOne(
      user.rollno ? { rollno: user.rollno } : { email: user.email }
    ).select("college year department section semester");
    if (roster) {
      enriched = {
        ...enriched,
        college: roster.college,
        year: roster.year,
        department: roster.department,
        section: roster.section,
        semester: roster.semester,
      };
    }
  }
  return { token, user: enriched };
};

const buildStudentResponse = (student) => {
  const email = student.email || `${student.rollno}@students.local`;
  const token = createJwtToken({
    id: student._id,
    role: "student",
    model: "Student",
    rollno: student.rollno,
    email,
  });
  return {
    token,
    user: {
      id: student._id,
      role: "student",
      name: student.name,
      email,
      rollno: student.rollno,
      college: student.college,
      year: student.year,
      department: student.department,
      section: student.section,
      semester: student.semester,
    },
  };
};

// Register Student (default role: student)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, year, department, section } =
      req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      college,
      year,
      department,
      section,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (User/Faculty/Admin only) — checks Users collection and falls back to roster-only student login
router.post("/login-user", async (req, res) => {
  console.log("REQ BODY:", req.body);
  try {
    const { email, password } = req.body;
    const identifier = (email || "").trim();
    const query = identifier.includes("@")
      ? { email: identifier }
      : { rollno: identifier };

    const user = await User.findOne(query);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      return res.json(await buildUserResponse(user));
    }

    const student = await Student.findOne(query);
    if (student && String(password) === String(student.rollno)) {
      return res.json(buildStudentResponse(student));
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (Student mode) — checks Students collection first, then Users collection for student accounts
router.post("/login-student", async (req, res) => {
  console.log("REQ BODY:", req.body);
  try {
    const { email, password } = req.body;
    const identifier = (email || "").trim();
    const query = identifier.includes("@")
      ? { email: identifier }
      : { rollno: identifier };

    const student = await Student.findOne(query);
    if (student) {
      const user = await User.findOne({ ...query, role: "student" });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.json(await buildUserResponse(user));
        }
      }

      if (String(password) === String(student.rollno)) {
        return res.json(buildStudentResponse(student));
      }
    }

    const user = await User.findOne({ ...query, role: "student" });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.json(await buildUserResponse(user));
      }
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Get User Info (Protected)
router.get("/user", authMiddleware, async (req, res) => {
  try {
    if (req.user.model === "Student") {
      const s = await Student.findById(req.user.id);
      if (!s) return res.status(404).json({ message: "User not found" });
      return res.json({
        id: s._id,
        role: "student",
        name: s.name,
        email: s.email || `${s.rollno}@students.local`,
        rollno: s.rollno,
        college: s.college,
        year: s.year,
        department: s.department,
        section: s.section,
        semester: s.semester,
      });
    } else {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.role === "student") {
        const roster = await Student.findOne(
          user.rollno ? { rollno: user.rollno } : { email: user.email }
        ).select("college year department section semester");
        const merged = {
          ...user.toObject(),
          college: roster?.college,
          year: roster?.year,
          department: roster?.department,
          section: roster?.section,
          semester: roster?.semester,
        };
        return res.json(merged);
      }
      return res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Update current user's profile (authenticated)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.model === "Student") {
      return res
        .status(403)
        .json({ message: "Students cannot update roster profile here" });
    }
    const { name, college, year, department, section } = req.body || {};

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof name === "string" && name.trim().length > 0)
      user.name = name.trim();
    if (typeof college === "string") user.college = college.trim();
    if (typeof department === "string") user.department = department.trim();

    if (year !== undefined) {
      const y = Number(year);
      if (!Number.isNaN(y)) user.year = y;
    }
    if (section !== undefined) {
      const s = Number(section);
      if (!Number.isNaN(s)) user.section = s;
    }

    // basic validation bounds per schema
    if (user.year != null && (user.year < 1 || user.year > 4)) {
      return res.status(400).json({ message: "Year must be between 1 and 4" });
    }
    if (user.section != null && (user.section < 1 || user.section > 5)) {
      return res
        .status(400)
        .json({ message: "Section must be between 1 and 5" });
    }

    await user.save();

    const { password, ...safe } = user.toObject();
    return res.json(safe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Change password (authenticated)
// POST /api/auth/change-password { currentPassword, newPassword }
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    if (req.user.model === "Student") {
      return res.status(403).json({
        message:
          "Password change for students is not supported in this endpoint.",
      });
    }
    const { currentPassword, newPassword } = req.body || {};
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      newPassword.length < 8
    ) {
      return res.status(400).json({
        message: "Provide currentPassword and newPassword (min 8 chars)",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok)
      return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
