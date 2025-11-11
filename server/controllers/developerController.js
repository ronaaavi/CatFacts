import db from '../config/db.js';
import multer from 'multer';
import path from 'path';

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/developers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique file name
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG and PNG files are allowed'));
    }
    cb(null, true);
  },
});

// 📄 Fetch all developers
export async function getAll(req, res) {
  try {
    const pool = await db.init();
    const [rows] = await pool.query('SELECT * FROM developers');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// 📄 Add new developer (with image upload)
export async function create(req, res) {
  try {
    const { name, role, github, bio, cat_name, cat_breed } = req.body;
    const files = req.files;
    const image_filename = files?.profile?.[0]?.filename || null;
    const cat_image_filename = files?.cat?.[0]?.filename || null;

    const pool = await db.init();
    const [result] = await pool.query(
      'INSERT INTO developers (name, github, role, bio, cat_name, cat_breed, image_filename, cat_image_filename) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, github, role, bio, cat_name, cat_breed, image_filename, cat_image_filename]
    );

    res.json({ id: result.insertId, name, role, image_filename, cat_image_filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// 📄 Update existing developer
export async function update(req, res) {
  try {
    const { name, role, github, bio, cat_name, cat_breed } = req.body;
    const files = req.files;
    const image_filename = files?.profile?.[0]?.filename || null;
    const cat_image_filename = files?.cat?.[0]?.filename || null;

    const pool = await db.init();
    await pool.query(
      'UPDATE developers SET name=?, github=?, role=?, bio=?, cat_name=?, cat_breed=?, image_filename=?, cat_image_filename=? WHERE id=?',
      [name, github, role, bio, cat_name, cat_breed, image_filename, cat_image_filename, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// 📄 Delete developer
export async function remove(req, res) {
  try {
    const pool = await db.init();
    await pool.query('DELETE FROM developers WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
