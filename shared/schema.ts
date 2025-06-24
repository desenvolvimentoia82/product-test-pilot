import { pgTable, text, serial, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "product_manager", "tester", "developer", "viewer"]);
export const releaseStatusEnum = pgEnum("release_status", ["development", "ready_for_test", "testing", "approved", "released"]);

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Product members table
export const productMembers = pgTable("product_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull(), // Using text for now since we don't have auth.users
  role: userRoleEnum("role").notNull().default("viewer"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Releases table
export const releases = pgTable("releases", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  status: releaseStatusEnum("status").default("development"),
  changelog: text("changelog"),
  test_environment: text("test_environment"),
  attachments: text("attachments").array(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Test suites table (adding this based on the frontend code)
export const testSuites = pgTable("test_suites", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  key: true,
  description: true,
});

export const insertReleaseSchema = createInsertSchema(releases).pick({
  product_id: true,
  name: true,
  status: true,
  changelog: true,
  test_environment: true,
  attachments: true,
});

export const insertTestSuiteSchema = createInsertSchema(testSuites).pick({
  product_id: true,
  name: true,
  description: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Release = typeof releases.$inferSelect;
export type InsertRelease = z.infer<typeof insertReleaseSchema>;
export type TestSuite = typeof testSuites.$inferSelect;
export type InsertTestSuite = z.infer<typeof insertTestSuiteSchema>;
export type ProductMember = typeof productMembers.$inferSelect;
export type UserRole = typeof userRoleEnum.enumValues[number];
export type ReleaseStatus = typeof releaseStatusEnum.enumValues[number];
