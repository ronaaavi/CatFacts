import db from '../config/db.js';

// ✅ GET all facts
export async function getAll(req, res) {
  try {
    const pool = await db.init();
    const [rows] = await pool.query('SELECT * FROM cat_facts');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cat facts' });
  }
}

// ✅ GET a single fact by ID
export async function getOne(req, res) {
  try {
    const { id } = req.params;
    const pool = await db.init();
    const [rows] = await pool.query('SELECT * FROM cat_facts WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Fact not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching fact' });
  }
}

// ✅ CREATE new fact
export async function create(req, res) {
  try {
    const { fact } = req.body;
    const pool = await db.init();
    const [result] = await pool.query('INSERT INTO cat_facts (fact) VALUES (?)', [fact]);
    res.status(201).json({ id: result.insertId, fact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating fact' });
  }
}

// ✅ UPDATE fact
export async function update(req, res) {
  try {
    const { id } = req.params;
    const { fact } = req.body;
    const pool = await db.init();
    await pool.query('UPDATE cat_facts SET fact = ? WHERE id = ?', [fact, id]);
    res.json({ message: 'Fact updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating fact' });
  }
}

// ✅ DELETE fact
export async function remove(req, res) {
  try {
    const { id } = req.params;
    const pool = await db.init();
    await pool.query('DELETE FROM cat_facts WHERE id = ?', [id]);
    res.json({ message: 'Fact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting fact' });
  }
}