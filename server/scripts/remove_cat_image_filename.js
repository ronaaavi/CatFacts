import db from '../config/db.js';

async function removeCatImageFilenameColumn() {
  try {
    const pool = await db.init();
    
    console.log('Removing cat_image_filename column from developers table...');
    
    // Drop the cat_image_filename column
    await pool.query(`
      ALTER TABLE developers 
      DROP COLUMN IF EXISTS cat_image_filename
    `);
    
    console.log('✅ Successfully removed cat_image_filename column!');
    process.exit(0);
  } catch (err) {
    console.error('Error removing column:', err);
    process.exit(1);
  }
}

removeCatImageFilenameColumn();
