// src/schema.ts
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().unique(),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
});

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
});
