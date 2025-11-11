import { drizzle } from 'drizzle-orm/libsql';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config();

import { migrate } from 'drizzle-orm/libsql/migrator';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = async () => {
    const dbClient = createClient({
        url: process.env.TURSO_CONNECTION_DEV_URL,
        // authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const db = drizzle(dbClient);
    console.log('Running migrations ... ');

    await migrate(db, {
        migrationsFolder: path.join(__dirname, '../drizzle/migrations'),
    });

    console.log('Database migration complete');
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
