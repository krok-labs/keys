import { sql, relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"


// User Schema
export const users = sqliteTable('users', {
    // - Internal ID
    id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
    
    // - Azure ID
    aid: text('aid').notNull()
});


// Key Schema
export const keys = sqliteTable('keys', {
    // - Internal ID
    id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
    nfcId: integer('nfc_id').notNull()
});


// Allowed Keys Schema
export const allowedKeys = sqliteTable('allowedKeys', {
    // - User ID
    userId: integer('user_id').notNull().references(() => users.id),

    // - Key ID
    keyId: integer('key_id').notNull().references(() => keys.id),
    
    // - Is Allowed
    isAllowed: integer('is_allowed', { mode: 'boolean' }).notNull().default(true),

    // - Creation Date
    createdAt: integer('created_date', { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),

    // - Updated Date
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// todo: Shared Keys

// User Relations
export const userRelations = relations(users, ({ many }) => ({
    allowedKeys: many(allowedKeys),
}));

// Allowed Keys Relations
export const allowedKeysRelations = relations(allowedKeys, ({ one }) => ({
    user: one(users, { fields: [allowedKeys.userId], references: [users.id] }),
    key: one(keys, { fields: [allowedKeys.keyId], references: [keys.id] })
}));

// Keys Relations
export const keysRelations = relations(keys, ({ many }) => ({
    allowedKeys: many(allowedKeys),
}));
