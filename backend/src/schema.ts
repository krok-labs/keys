import { sql, relations, InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, blob } from "drizzle-orm/sqlite-core"

// User Schema
export const users = sqliteTable('users', {
    // - Internal ID
    id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
    
    // - Azure ID
    aid: text('aid').notNull().unique()
});

export type UsersModel = InferSelectModel<typeof users>;

// Key Schema
export const keys = sqliteTable('keys', {
    // - Internal ID
    id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
    nfcId: integer('nfc_id').notNull(),
    description: text('description'),
    title: text('title').notNull(),
    floor: integer('floor'),
});

export type KeysModel = InferSelectModel<typeof keys>;

// KeyContract Schema
export const keyContracts = sqliteTable('key_contract', {
    id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
    userId: integer('user_id').notNull().references(() => users.id),
    keyId: integer('key_id').notNull().references(() => keys.id),
    state: text('state', { enum: ['CURRENTLY_HOLDING', 'DEPOSITED'] }).notNull().default('CURRENTLY_HOLDING'),
    pickedUpAt: text('picked_up_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    depositedAt: text('deposited_at'),
});

export type KeyContractsModel = InferSelectModel<typeof keyContracts>;

// Allowed Keys Schema
export const allowedKeys = sqliteTable('allowed_keys', {
    // - User ID
    userId: integer('user_id').notNull().references(() => users.id),

    // - Key ID
    keyId: integer('key_id').notNull().references(() => keys.id),
    
    // - Is Allowed
    isAllowed: integer('is_allowed', { mode: 'boolean' }).notNull().default(true),

    // - Creation Date
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),

    // - Updated Date
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type AllowedKeysModel = InferSelectModel<typeof allowedKeys>;

// Temporary Keycards-Pass Schema
export const temporaryKeycards = sqliteTable('temporary_keycards', {
    id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),

    surname: text('surname').notNull(),
    firstname: text('firstname').notNull(),
    middlename: text('middlename').notNull(),
    
    documentsImage: text('documents_scan_image').notNull(),
    faceImage: text('person_scan_image').notNull(),

    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    expiresAt: text('expires_at').notNull().default(sql`date('now', 'start of day', '+24 hours')`),
    depositedAt: text('deposited_at'),
});

export type TemporaryKeycardsModel = InferSelectModel<typeof temporaryKeycards>;

// todo: Shared Keys

// User Relations
export const userRelations = relations(users, ({ many }) => ({
    allowedKeys: many(allowedKeys),
    contracts: many(keyContracts),
}));

// Allowed Keys Relations
export const allowedKeysRelations = relations(allowedKeys, ({ one }) => ({
    user: one(users, { fields: [allowedKeys.userId], references: [users.id] }),
    key: one(keys, { fields: [allowedKeys.keyId], references: [keys.id] })
}));

export const keyContractsRelations = relations(keyContracts, ({ one }) => ({
    user: one(users, { fields: [keyContracts.userId], references: [users.id] }),
    key: one(keys, { fields: [keyContracts.keyId], references: [keys.id] }),
}));

// Keys Relations
export const keysRelations = relations(keys, ({ one, many }) => ({
    allowedKeys: many(allowedKeys),
    contracts: many(keyContracts),
}));
