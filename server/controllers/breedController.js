import db from '../config/db.js';

export async function getAll(req, res) {
  try {
    const pool = await db.init();
    const [rows] = await pool.query('SELECT * FROM breeds');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getOne(req, res) {
  try {
    const pool = await db.init();
    const [rows] = await pool.query('SELECT * FROM breeds WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function create(req, res) {
  try {
    const pool = await db.init();
    const breed = req.body;
    const [result] = await pool.query('INSERT INTO breeds SET ?', breed);
    res.json({ id: result.insertId, ...breed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function update(req, res) {
  try {
    const pool = await db.init();
    const breed = req.body;
    await pool.query('UPDATE breeds SET ? WHERE id = ?', [breed, req.params.id]);
    res.json({ id: req.params.id, ...breed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function remove(req, res) {
  try {
    const pool = await db.init();
    await pool.query('DELETE FROM breeds WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
