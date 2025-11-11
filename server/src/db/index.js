import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config();

import * as schema from './schema.js';

const client = createClient({
    url: process.env.TURSO_CONNECTION_DEV_URL,
    // authToken: env.TURSO_AUTH_TOKEN, // TODO : Uncomment this line if you are pushing it to production
});

export const db = drizzle(client, { schema });
