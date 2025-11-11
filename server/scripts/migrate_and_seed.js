import db from '../config/db.js';

async function migrateAndSeed() {
  try {
    const pool = await db.init();

    // Create tables with the requested schema names
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cat_breeds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        origin VARCHAR(255),
        description TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        breed_id INT,
        age INT,
        FOREIGN KEY (breed_id) REFERENCES cat_breeds(id) ON DELETE SET NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS developers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        role VARCHAR(255)
      );
    `);

    // Add a UNIQUE index on fact (prefix) so we can ignore duplicates on insert
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cat_facts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fact TEXT NOT NULL,
        UNIQUE KEY uq_fact (fact(255))
      );
    `);

    // Seed minimal data for breeds, cats and developers if empty
    const [[{ cnt: breedsCnt }]] = await pool.query('SELECT COUNT(*) as cnt FROM cat_breeds');
    if (breedsCnt === 0) {
      await pool.query('INSERT INTO cat_breeds (name, origin, description) VALUES ?', [
        [ ['Munchkin','Unknown','Small legs, big personality'], ['Siamese','Thailand','Vocal and affectionate'], ['Maine Coon','USA','Large, friendly'] ]
      ]);
      console.log('Seeded cat_breeds');
    }

    const [[{ cnt: catsCnt }]] = await pool.query('SELECT COUNT(*) as cnt FROM cats');
    if (catsCnt === 0) {
      await pool.query('INSERT INTO cats (name, breed_id, age) VALUES ?', [
        [ ['Luna',1,2], ['Kai',2,4], ['Munch',1,1] ]
      ]);
      console.log('Seeded cats');
    }

    const [[{ cnt: devCnt }]] = await pool.query('SELECT COUNT(*) as cnt FROM developers');
    if (devCnt === 0) {
      await pool.query('INSERT INTO developers (name, role) VALUES ?', [
        [ ['Rona','Frontend'], ['Alex','Backend'] ]
      ]);
      console.log('Seeded developers');
    }

    // Call seedFacts.js to populate cat_facts
    const { seedCatFacts } = await import('./seedFacts.js');
    await seedCatFacts(pool);

    console.log('✅ Database migrated and seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err?.message || err);
    process.exit(1);
  }
}

migrateAndSeed();
