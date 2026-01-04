import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

// ============================================
// AUTH TABLES (Auth.js compatible)
// ============================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  image: varchar("image", { length: 500 }),
  password: varchar("password", { length: 255 }).notNull(), // required for credentials auth
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ============================================
// APP TABLES
// ============================================

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(), // Unique identifier matching geodata
  name: varchar("name", { length: 100 }).notNull(),
  population: integer("population"),
  shortDescription: varchar("short_description", { length: 200 }),
  description: varchar("description", { length: 2000 }),
  image: varchar("image", { length: 500 }), // Legacy field, kept for backward compatibility
  images: text("images").$type<string[]>().array().default([]), // Array of image URLs
  placesToVisit: varchar("places_to_visit", { length: 1000 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const userVisits = pgTable(
  "user_visits",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    regionCode: varchar("region_code", { length: 50 })
      .notNull()
      .references(() => regions.code, { onDelete: "cascade" }),
    visitedAt: timestamp("visited_at", { mode: "date" }).defaultNow().notNull(),
    notes: varchar("notes", { length: 500 }),
    rating: integer("rating"), // 1-5 stars
    isPublic: boolean("is_public").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.regionCode)]
);

// ============================================
// TYPE EXPORTS
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;
export type UserVisit = typeof userVisits.$inferSelect;
export type NewUserVisit = typeof userVisits.$inferInsert;
