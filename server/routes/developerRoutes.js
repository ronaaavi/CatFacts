import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../config/db.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "uploads/developers";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .jpg and .png are allowed"));
  },
});

// GET all developers
router.get("/", async (req, res) => {
  try {
    const pool = await db.init();
    const [rows] = await pool.query("SELECT * FROM developers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new developer
router.post("/", upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'catImage', maxCount: 1 }
]), async (req, res) => {
  console.log('POST /api/developers - Request received');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  try {
    const { name, role, github, bio, cat_name, cat_breed } = req.body;
    const profileImagePath = req.files?.profileImage?.[0] ? `/uploads/developers/${req.files.profileImage[0].filename}` : null;
    const catImagePath = req.files?.catImage?.[0] ? `/uploads/developers/${req.files.catImage[0].filename}` : null;

    console.log('Inserting developer:', { name, role, github, bio, cat_name, cat_breed });

    const pool = await db.init();
    const result = await pool.query(
      "INSERT INTO developers (name, role, github, bio, cat_name, cat_breed, profile_image, cat_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, role, github || null, bio || null, cat_name || null, cat_breed || null, profileImagePath, catImagePath]
    );

    console.log('Insert result:', result);
    res.json({ success: true, message: "Developer added successfully!" });
  } catch (err) {
    console.error('Error adding developer:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update developer
router.put("/:id", upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'catImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, github, bio, cat_name, cat_breed } = req.body;

    const pool = await db.init();

    // Get existing developer
    const [rows] = await pool.query("SELECT * FROM developers WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Developer not found" });
    const existing = rows[0];

    // Handle new profile image
    let profileImagePath = existing.profile_image;
    if (req.files?.profileImage?.[0]) {
      if (existing.profile_image) {
        const oldPath = path.join(process.cwd(), existing.profile_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      profileImagePath = `/uploads/developers/${req.files.profileImage[0].filename}`;
    }

    // Handle new cat image
    let catImagePath = existing.cat_image;
    if (req.files?.catImage?.[0]) {
      if (existing.cat_image) {
        const oldPath = path.join(process.cwd(), existing.cat_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      catImagePath = `/uploads/developers/${req.files.catImage[0].filename}`;
    }

    await pool.query(
      "UPDATE developers SET name = ?, role = ?, github = ?, bio = ?, cat_name = ?, cat_breed = ?, profile_image = ?, cat_image = ? WHERE id = ?",
      [name, role, github || existing.github, bio || existing.bio, cat_name || existing.cat_name, cat_breed || existing.cat_breed, profileImagePath, catImagePath, id]
    );

    res.json({ success: true, message: "Developer updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE developer and remove image files
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await db.init();

    // Get existing developer
    const [rows] = await pool.query("SELECT * FROM developers WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Developer not found" });
    const existing = rows[0];

    // Delete profile image file if exists
    if (existing.profile_image) {
      const imgPath = path.join(process.cwd(), existing.profile_image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // Delete cat image file if exists
    if (existing.cat_image) {
      const catImgPath = path.join(process.cwd(), existing.cat_image);
      if (fs.existsSync(catImgPath)) fs.unlinkSync(catImgPath);
    }

    // Delete developer from database
    await pool.query("DELETE FROM developers WHERE id = ?", [id]);

    res.json({ success: true, message: "Developer deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
