//src/utils/seed.ts
import { seedHospitals } from './seedHospitals';
import logger from './logger'; // Changed to default import

const seeders = {
  hospitals: seedHospitals
};

const runSeeder = async (seederName: string = 'all') => {
  try {
    if (seederName === 'all') {
      logger.info('Running all seeders...');
      for (const [name, seeder] of Object.entries(seeders)) {
        logger.info(`Running ${name} seeder...`);
        await seeder();
      }
      logger.info('All seeders completed successfully');
    } else if (seeders[seederName as keyof typeof seeders]) {
      logger.info(`Running ${seederName} seeder...`);
      await seeders[seederName as keyof typeof seeders]();
      logger.info(`${seederName} seeder completed successfully`);
    } else {
      throw new Error(`Seeder '${seederName}' not found. Available seeders: ${Object.keys(seeders).join(', ')}`);
    }
  } catch (error) {
    logger.error('Seeder error:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  const seederName = process.argv[2] || 'all';
  
  runSeeder(seederName)
    .then(() => {
      logger.info('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export { runSeeder, seedHospitals };