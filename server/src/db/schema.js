import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
    id: real('id').primaryKey(),
    fullName: text('full_name'),
    email: text('email').notNull().unique(),
});

const certificates = sqliteTable('certificates', {
    id: real('id').primaryKey(),
    userId: real('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    certificate: text('certificate_id', { mode: 'json' }).notNull().unique(),
});

export { users, certificates };
