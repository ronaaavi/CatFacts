import db from '../config/db.js';

async function addCatImageColumn() {
  try {
    const pool = await db.init();
    
    console.log('Adding cat_image column to developers table...');
    
    // Add cat_image column
    await pool.query(`
      ALTER TABLE developers 
      ADD COLUMN IF NOT EXISTS cat_image VARCHAR(255) NULL
    `);
    
    console.log('✅ Successfully added cat_image column!');
    process.exit(0);
  } catch (err) {
    console.error('Error adding column:', err);
    process.exit(1);
  }
}

addCatImageColumn();
