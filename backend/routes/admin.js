const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const XLSX = require("xlsx");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Admin-only: Create a faculty account
// POST /api/admin/faculty
router.post("/faculty", auth, auth.requireRole("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "faculty",
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin-only: List all faculty
// GET /api/admin/faculty
router.get("/faculty", auth, auth.requireRole("admin"), async (_req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });
    return res.json(faculty);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

// Admin-only: Bulk upload students via CSV/XLSX
// POST /api/admin/students/upload (form-data: file)
router.post(
  "/students/upload",
  auth,
  auth.requireRole("admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      // Parse buffer with xlsx; supports .csv, .xlsx, .xls
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Helper to normalize header keys
      const norm = (s) =>
        String(s || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

      let created = 0;
      let skipped = 0;
      const errors = [];

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        // Build a case-insensitive map
        const map = {};
        Object.keys(r).forEach((k) => (map[norm(k)] = r[k]));

        const rollno = String(map["rollno"] || map["rollnumber"] || "").trim();
        const name = String(map["name"] || "").trim();
        const dept = String(map["dept"] || map["department"] || "").trim();
        const college = String(map["college"] || "").trim();
        const sectionRaw = String(map["section"] || "").trim();
        const semRaw = String(map["semester"] || map["sem"] || "").trim();

        if (!rollno || !name) {
          skipped++;
          errors.push({ row: i + 2, error: "Missing rollno or name" }); // +2 accounting header and 1-index
          continue;
        }

        // Prepare fields
        const email = `${rollno}@students.local`;
        const section = sectionRaw ? Number(sectionRaw) : undefined;
        const semester = semRaw ? Number(semRaw) : undefined;
        const year = semester
          ? Math.max(1, Math.min(8, Math.ceil(semester / 2)))
          : undefined;

        // Skip if user already exists by rollno or email
        const existing = await User.findOne({ $or: [{ rollno }, { email }] });
        if (existing) {
          skipped++;
          continue;
        }

        // Default password is roll number
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rollno, salt);

        try {
          await User.create({
            name,
            email,
            rollno,
            password: hashedPassword,
            role: "student",
            college: college || undefined,
            year,
            department: dept || undefined,
            section:
              typeof section === "number" && !Number.isNaN(section)
                ? section
                : undefined,
            semester:
              typeof semester === "number" && !Number.isNaN(semester)
                ? semester
                : undefined,
          });
          created++;
        } catch (e) {
          skipped++;
          errors.push({ row: i + 2, error: e.message });
        }
      }

      return res.json({ total: rows.length, created, skipped, errors });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to process file" });
    }
  }
);
