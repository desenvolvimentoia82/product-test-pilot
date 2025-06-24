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

// Test suites table
export const testSuites = pgTable("test_suites", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  revision: integer("revision").default(1),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Test suite version history table
export const testSuiteVersions = pgTable("test_suite_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  test_suite_id: uuid("test_suite_id").references(() => testSuites.id, { onDelete: "cascade" }),
  revision: integer("revision").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  changes: text("changes"), // JSON string of what changed
  change_summary: text("change_summary"), // Human readable summary
  changed_by: text("changed_by").default("Demo User"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Test cases table
export const testCases = pgTable("test_cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  test_suite_id: uuid("test_suite_id").references(() => testSuites.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  steps: text("steps"),
  expected_result: text("expected_result"),
  priority: text("priority").default("medium"), // low, medium, high, critical
  status: text("status").default("active"), // active, inactive, deprecated
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Test plans table
export const testPlans = pgTable("test_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  release_id: uuid("release_id").references(() => releases.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  start_date: timestamp("start_date", { withTimezone: true }),
  end_date: timestamp("end_date", { withTimezone: true }),
  status: text("status").default("planning"), // planning, active, completed, cancelled
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Test plan suites (many-to-many relationship)
export const testPlanSuites = pgTable("test_plan_suites", {
  id: uuid("id").primaryKey().defaultRandom(),
  test_plan_id: uuid("test_plan_id").references(() => testPlans.id, { onDelete: "cascade" }),
  test_suite_id: uuid("test_suite_id").references(() => testSuites.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Test executions table
export const testExecutions = pgTable("test_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  test_plan_id: uuid("test_plan_id").references(() => testPlans.id, { onDelete: "cascade" }),
  test_case_id: uuid("test_case_id").references(() => testCases.id, { onDelete: "cascade" }),
  executor_name: text("executor_name").notNull(),
  status: text("status").default("pending"), // pending, passed, failed, blocked, skipped
  execution_date: timestamp("execution_date", { withTimezone: true }).defaultNow(),
  notes: text("notes"),
  attachments: text("attachments").array(),
  execution_time: integer("execution_time"), // in minutes
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
  revision: true,
});

export const insertTestSuiteVersionSchema = createInsertSchema(testSuiteVersions).pick({
  test_suite_id: true,
  revision: true,
  name: true,
  description: true,
  changes: true,
  change_summary: true,
  changed_by: true,
});

export const insertTestCaseSchema = createInsertSchema(testCases).pick({
  test_suite_id: true,
  title: true,
  description: true,
  steps: true,
  expected_result: true,
  priority: true,
  status: true,
});

export const insertTestPlanSchema = createInsertSchema(testPlans).pick({
  product_id: true,
  release_id: true,
  name: true,
  description: true,
  start_date: true,
  end_date: true,
  status: true,
});

export const insertTestExecutionSchema = createInsertSchema(testExecutions).pick({
  test_plan_id: true,
  test_case_id: true,
  executor_name: true,
  status: true,
  execution_date: true,
  notes: true,
  attachments: true,
  execution_time: true,
}).extend({
  execution_date: z.string().transform((str) => new Date(str)),
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
export type TestSuiteVersion = typeof testSuiteVersions.$inferSelect;
export type InsertTestSuiteVersion = z.infer<typeof insertTestSuiteVersionSchema>;
export type TestCase = typeof testCases.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
export type TestPlan = typeof testPlans.$inferSelect;
export type InsertTestPlan = z.infer<typeof insertTestPlanSchema>;
export type TestExecution = typeof testExecutions.$inferSelect;
export type InsertTestExecution = z.infer<typeof insertTestExecutionSchema>;
export type ProductMember = typeof productMembers.$inferSelect;
export type UserRole = typeof userRoleEnum.enumValues[number];
export type ReleaseStatus = typeof releaseStatusEnum.enumValues[number];
