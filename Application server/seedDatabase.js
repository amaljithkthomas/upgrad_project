const mongoose = require('mongoose');
const config = require('config');
const { seedAll } = require('./utils/seedData');

const db = config.get('mongoURI');

async function main() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(db);
    console.log('✅ Connected to MongoDB\n');

    await seedAll();

    console.log('\n✅ Database seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err);
    process.exit(1);
  }
}

main();