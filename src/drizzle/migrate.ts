import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from 'dotenv';

config();

const databaseUrl = process.env.DATABASE_URL!;
const sql = postgres(databaseUrl, { max: 1 });
const db = drizzle(sql);

async function main() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'src/drizzle/migrations' });
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();