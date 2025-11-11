import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'turso',
    schema: './src/db/schema.js',
    out: './drizzle/migrations',
    dbCredentials: {
        url: process.env.TURSO_CONNECTION_DEV_URL,
        // authToken: process.env.TURSO_AUTH_TOKEN, // TODO : Uncomment this line if you are pushing it to production
    },
});
