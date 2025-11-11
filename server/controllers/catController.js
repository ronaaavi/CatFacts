import db from '../config/db.js';

export async function getAll(req, res) {
  try {
    const pool = await db.init();
    const [rows] = await pool.query(`SELECT c.*, b.name as breed_name, b.description as breed_description FROM cats c LEFT JOIN breeds b ON c.breed_id = b.id`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getOne(req, res) {
  try {
    const pool = await db.init();
    const [rows] = await pool.query('SELECT * FROM cats WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function create(req, res) {
  try {
    const pool = await db.init();
    const cat = req.body;
    const [result] = await pool.query('INSERT INTO cats SET ?', cat);
    res.json({ id: result.insertId, ...cat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function update(req, res) {
  try {
    const pool = await db.init();
    const cat = req.body;
    await pool.query('UPDATE cats SET ? WHERE id = ?', [cat, req.params.id]);
    res.json({ id: req.params.id, ...cat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function remove(req, res) {
  try {
    const pool = await db.init();
    await pool.query('DELETE FROM cats WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
