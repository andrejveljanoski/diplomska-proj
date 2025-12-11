import {
  timestamp,
  pgTable,
  primaryKey,
  integer,
  serial,
  real,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// ============================================
// AUTH TABLES (Required by Auth.js)
// ============================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: varchar("image", { length: 500 }),
  password: varchar("password", { length: 255 }), // null for OAuth users
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: varchar("refresh_token", { length: 500 }),
    access_token: varchar("access_token", { length: 500 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 50 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2000 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ============================================
// APP TABLES
// ============================================

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).unique().notNull(), // e.g., "MK-SK" for Skopje
  name: varchar("name", { length: 100 }).notNull(),
  population: integer("population"),
  area: real("area"), // km²
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const userVisits = pgTable("user_visits", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  regionId: integer("region_id")
    .notNull()
    .references(() => regions.id, { onDelete: "cascade" }),
  visitedAt: timestamp("visited_at", { mode: "date" }).defaultNow().notNull(),
  notes: varchar("notes", { length: 500 }),
  rating: integer("rating"), // 1-5 stars
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;
export type UserVisit = typeof userVisits.$inferSelect;
export type NewUserVisit = typeof userVisits.$inferInsert;
