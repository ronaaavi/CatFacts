import db from '../config/db.js';

export async function seedCatFacts(poolParam) {
  try {
    const pool = poolParam || await db.init();

    // Local fallback facts - no external API calls
    const facts = [
      'Cats sleep 12-16 hours a day.',
      'A group of cats is called a clowder.',
      'Cats have five toes on their front paws, but only four on the back ones.',
      'A cat’s nose is ridged with a unique pattern, just like a human fingerprint.',
      'Cats can jump up to six times their length.'
    ];

    const rows = facts.map(f => [f]);
    if (rows.length === 0) {
      console.log('No facts to insert');
      return;
    }

    await pool.query('INSERT INTO cat_facts (fact) VALUES ? ON DUPLICATE KEY UPDATE fact = VALUES(fact)', [rows]);

    console.log('✅ Cat facts seeded successfully!');
    return;
  } catch (err) {
    console.error('Failed to seed facts', err?.message || err);
    throw err;
  }
}

// allow running directly
if (process.argv[1] && process.argv[1].endsWith('seedFacts.js')) {
  seedCatFacts().then(() => process.exit(0)).catch(() => process.exit(1));
}
