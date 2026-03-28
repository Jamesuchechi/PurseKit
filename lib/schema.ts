import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ─── History Items ───────────────────────────────────────────

export const historyItems = pgTable("history_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  module: text("module").notNull(), // 'devlens' | 'specforge' | 'chartgpt'
  title: text("title").notNull(),
  input: text("input").notNull(),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type HistoryItemRow = typeof historyItems.$inferSelect;
export type NewHistoryItem = typeof historyItems.$inferInsert;
