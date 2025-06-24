import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  products, 
  releases, 
  testSuites,
  testSuiteVersions,
  testCases,
  testCaseVersions,
  testPlans,
  testPlanExecutions,
  testCaseExecutions,
  insertProductSchema, 
  insertReleaseSchema, 
  insertTestSuiteSchema,
  insertTestSuiteVersionSchema,
  insertTestCaseSchema,
  insertTestCaseVersionSchema,
  insertTestPlanSchema,
  insertTestPlanExecutionSchema,
  insertTestCaseExecutionSchema
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const [newProduct] = await db.insert(products).values(validatedData).returning();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductSchema.parse(req.body);
      const [updatedProduct] = await db
        .update(products)
        .set({ ...validatedData, updated_at: new Date() })
        .where(eq(products.id, id))
        .returning();
      
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Releases routes
  app.get("/api/releases", async (req, res) => {
    try {
      const { product_id } = req.query;
      let allReleases;
      
      if (product_id) {
        allReleases = await db
          .select()
          .from(releases)
          .where(eq(releases.product_id, product_id as string));
      } else {
        allReleases = await db.select().from(releases);
      }
      
      res.json(allReleases);
    } catch (error) {
      console.error("Error fetching releases:", error);
      res.status(500).json({ error: "Failed to fetch releases" });
    }
  });

  app.post("/api/releases", async (req, res) => {
    try {
      const validatedData = insertReleaseSchema.parse(req.body);
      const [newRelease] = await db.insert(releases).values(validatedData).returning();
      res.status(201).json(newRelease);
    } catch (error) {
      console.error("Error creating release:", error);
      res.status(400).json({ error: "Failed to create release" });
    }
  });

  app.put("/api/releases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertReleaseSchema.parse(req.body);
      const [updatedRelease] = await db
        .update(releases)
        .set({ ...validatedData, updated_at: new Date() })
        .where(eq(releases.id, id))
        .returning();
      
      if (!updatedRelease) {
        return res.status(404).json({ error: "Release not found" });
      }
      
      res.json(updatedRelease);
    } catch (error) {
      console.error("Error updating release:", error);
      res.status(400).json({ error: "Failed to update release" });
    }
  });

  app.delete("/api/releases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedRelease] = await db
        .delete(releases)
        .where(eq(releases.id, id))
        .returning();
      
      if (!deletedRelease) {
        return res.status(404).json({ error: "Release not found" });
      }
      
      res.json({ message: "Release deleted successfully" });
    } catch (error) {
      console.error("Error deleting release:", error);
      res.status(500).json({ error: "Failed to delete release" });
    }
  });

  // Test suites routes
  app.get("/api/test-suites", async (req, res) => {
    try {
      const { product_id, include_archived } = req.query;
      let query = db.select().from(testSuites);
      
      if (product_id) {
        if (include_archived === 'true') {
          query = query.where(eq(testSuites.product_id, product_id as string));
        } else {
          query = query.where(
            and(
              eq(testSuites.product_id, product_id as string),
              eq(testSuites.status, "active")
            )
          );
        }
      } else {
        if (include_archived !== 'true') {
          query = query.where(eq(testSuites.status, "active"));
        }
      }
      
      const allTestSuites = await query;
      res.json(allTestSuites);
    } catch (error) {
      console.error("Error fetching test suites:", error);
      res.status(500).json({ error: "Failed to fetch test suites" });
    }
  });

  app.post("/api/test-suites", async (req, res) => {
    try {
      const validatedData = insertTestSuiteSchema.parse(req.body);
      const [newTestSuite] = await db.insert(testSuites).values(validatedData).returning();
      res.status(201).json(newTestSuite);
    } catch (error) {
      console.error("Error creating test suite:", error);
      res.status(400).json({ error: "Failed to create test suite" });
    }
  });

  app.put("/api/test-suites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { change_summary, ...validatedData } = insertTestSuiteSchema.extend({
        change_summary: z.string().optional()
      }).parse(req.body);
      
      // Get current test suite for comparison
      const [currentSuite] = await db.select().from(testSuites).where(eq(testSuites.id, id));
      if (!currentSuite) {
        return res.status(404).json({ error: "Test suite not found" });
      }
      
      // Calculate changes
      const changes = {
        name: currentSuite.name !== validatedData.name ? { from: currentSuite.name, to: validatedData.name } : null,
        description: currentSuite.description !== validatedData.description ? { from: currentSuite.description, to: validatedData.description } : null,
      };
      
      const hasChanges = Object.values(changes).some(change => change !== null);
      
      if (hasChanges) {
        // Create version history entry
        await db.insert(testSuiteVersions).values({
          test_suite_id: id,
          revision: currentSuite.revision,
          name: currentSuite.name,
          description: currentSuite.description,
          changes: JSON.stringify(changes),
          change_summary: change_summary || "Atualização automática",
          changed_by: "Demo User"
        });
      }
      
      const [updatedTestSuite] = await db
        .update(testSuites)
        .set({ 
          ...validatedData, 
          updated_at: new Date(),
          revision: hasChanges ? (currentSuite.revision + 1) : currentSuite.revision
        })
        .where(eq(testSuites.id, id))
        .returning();
      
      res.json(updatedTestSuite);
    } catch (error) {
      console.error("Error updating test suite:", error);
      res.status(400).json({ error: "Failed to update test suite" });
    }
  });

  // Get test suite version history
  app.get("/api/test-suites/:id/versions", async (req, res) => {
    try {
      const { id } = req.params;
      const versions = await db
        .select()
        .from(testSuiteVersions)
        .where(eq(testSuiteVersions.test_suite_id, id))
        .orderBy(desc(testSuiteVersions.revision));
      
      res.json(versions);
    } catch (error) {
      console.error("Error fetching test suite versions:", error);
      res.status(500).json({ error: "Failed to fetch test suite versions" });
    }
  });

  // Revert test suite to a specific version
  app.post("/api/test-suites/:id/revert/:revision", async (req, res) => {
    try {
      const { id, revision } = req.params;
      
      // Get the version to revert to
      const [targetVersion] = await db
        .select()
        .from(testSuiteVersions)
        .where(
          and(
            eq(testSuiteVersions.test_suite_id, id),
            eq(testSuiteVersions.revision, parseInt(revision))
          )
        );
      
      if (!targetVersion) {
        return res.status(404).json({ error: "Version not found" });
      }
      
      // Get current suite
      const [currentSuite] = await db.select().from(testSuites).where(eq(testSuites.id, id));
      if (!currentSuite) {
        return res.status(404).json({ error: "Test suite not found" });
      }
      
      // Create version history entry for the revert
      await db.insert(testSuiteVersions).values({
        test_suite_id: id,
        revision: currentSuite.revision,
        name: currentSuite.name,
        description: currentSuite.description,
        changes: JSON.stringify({ revert_to: targetVersion.revision }),
        change_summary: `Revertido para revisão ${targetVersion.revision}`,
        changed_by: "Demo User"
      });
      
      // Update the test suite with the target version data
      const [updatedTestSuite] = await db
        .update(testSuites)
        .set({
          name: targetVersion.name,
          description: targetVersion.description,
          revision: currentSuite.revision + 1,
          updated_at: new Date()
        })
        .where(eq(testSuites.id, id))
        .returning();
      
      res.json(updatedTestSuite);
    } catch (error) {
      console.error("Error reverting test suite:", error);
      res.status(500).json({ error: "Failed to revert test suite" });
    }
  });

  // Archive test suite instead of deleting
  app.put("/api/test-suites/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      const [updatedTestSuite] = await db
        .update(testSuites)
        .set({ 
          status: "archived",
          updated_at: new Date()
        })
        .where(eq(testSuites.id, id))
        .returning();
      
      if (!updatedTestSuite) {
        return res.status(404).json({ error: "Test suite not found" });
      }
      
      res.json(updatedTestSuite);
    } catch (error) {
      console.error("Error archiving test suite:", error);
      res.status(500).json({ error: "Failed to archive test suite" });
    }
  });

  // Test cases routes
  app.get("/api/test-cases", async (req, res) => {
    try {
      const { test_suite_id } = req.query;
      let allTestCases;
      
      if (test_suite_id) {
        allTestCases = await db
          .select()
          .from(testCases)
          .where(eq(testCases.test_suite_id, test_suite_id as string));
      } else {
        allTestCases = await db.select().from(testCases);
      }
      
      res.json(allTestCases);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      res.status(500).json({ error: "Failed to fetch test cases" });
    }
  });

  app.post("/api/test-cases", async (req, res) => {
    try {
      const validatedData = insertTestCaseSchema.parse(req.body);
      const [newTestCase] = await db.insert(testCases).values(validatedData).returning();
      res.status(201).json(newTestCase);
    } catch (error) {
      console.error("Error creating test case:", error);
      res.status(400).json({ error: "Failed to create test case" });
    }
  });

  app.put("/api/test-cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { change_summary, ...validatedData } = insertTestCaseSchema.extend({
        change_summary: z.string().optional()
      }).parse(req.body);
      
      // Get current test case for comparison
      const [currentCase] = await db.select().from(testCases).where(eq(testCases.id, id));
      if (!currentCase) {
        return res.status(404).json({ error: "Test case not found" });
      }
      
      // Calculate changes
      const changes = {
        title: currentCase.title !== validatedData.title ? { from: currentCase.title, to: validatedData.title } : null,
        description: currentCase.description !== validatedData.description ? { from: currentCase.description, to: validatedData.description } : null,
        steps: currentCase.steps !== validatedData.steps ? { from: currentCase.steps, to: validatedData.steps } : null,
        expected_result: currentCase.expected_result !== validatedData.expected_result ? { from: currentCase.expected_result, to: validatedData.expected_result } : null,
        priority: currentCase.priority !== validatedData.priority ? { from: currentCase.priority, to: validatedData.priority } : null,
      };
      
      const hasChanges = Object.values(changes).some(change => change !== null);
      
      if (hasChanges) {
        // Create version history entry
        await db.insert(testCaseVersions).values({
          test_case_id: id,
          revision: currentCase.revision,
          title: currentCase.title,
          description: currentCase.description,
          steps: currentCase.steps,
          expected_result: currentCase.expected_result,
          priority: currentCase.priority,
          status: currentCase.status,
          changes: JSON.stringify(changes),
          change_summary: change_summary || "Atualização automática",
          changed_by: "Demo User"
        });
      }
      
      const [updatedTestCase] = await db
        .update(testCases)
        .set({ 
          ...validatedData, 
          updated_at: new Date(),
          revision: hasChanges ? (currentCase.revision + 1) : currentCase.revision
        })
        .where(eq(testCases.id, id))
        .returning();
      
      res.json(updatedTestCase);
    } catch (error) {
      console.error("Error updating test case:", error);
      res.status(400).json({ error: "Failed to update test case" });
    }
  });

  app.delete("/api/test-cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedTestCase] = await db
        .delete(testCases)
        .where(eq(testCases.id, id))
        .returning();
      
      if (!deletedTestCase) {
        return res.status(404).json({ error: "Test case not found" });
      }
      
      res.json({ message: "Test case deleted successfully" });
    } catch (error) {
      console.error("Error deleting test case:", error);
      res.status(500).json({ error: "Failed to delete test case" });
    }
  });

  // Test plans routes
  app.get("/api/test-plans", async (req, res) => {
    try {
      const { product_id } = req.query;
      let allTestPlans;
      
      if (product_id) {
        allTestPlans = await db
          .select()
          .from(testPlans)
          .where(eq(testPlans.product_id, product_id as string));
      } else {
        allTestPlans = await db.select().from(testPlans);
      }
      
      res.json(allTestPlans);
    } catch (error) {
      console.error("Error fetching test plans:", error);
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });

  app.post("/api/test-plans", async (req, res) => {
    try {
      const validatedData = insertTestPlanSchema.parse(req.body);
      
      // Transform date strings to Date objects or null
      const processedData = {
        ...validatedData,
        start_date: validatedData.start_date && validatedData.start_date !== '' ? new Date(validatedData.start_date) : null,
        end_date: validatedData.end_date && validatedData.end_date !== '' ? new Date(validatedData.end_date) : null,
      };
      
      // Verify that test suite exists and belongs to the same product
      const [testSuite] = await db
        .select()
        .from(testSuites)
        .where(eq(testSuites.id, processedData.test_suite_id));
      
      if (!testSuite) {
        return res.status(400).json({ error: "Test suite not found" });
      }
      
      if (testSuite.product_id !== processedData.product_id) {
        return res.status(400).json({ error: "Test suite does not belong to the specified product" });
      }
      
      const [newTestPlan] = await db.insert(testPlans).values(processedData).returning();
      res.status(201).json(newTestPlan);
    } catch (error) {
      console.error("Error creating test plan:", error);
      res.status(400).json({ error: "Failed to create test plan" });
    }
  });

  app.put("/api/test-plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTestPlanSchema.parse(req.body);
      
      // Transform date strings to Date objects or null
      const processedData = {
        ...validatedData,
        start_date: validatedData.start_date && validatedData.start_date !== '' ? new Date(validatedData.start_date) : null,
        end_date: validatedData.end_date && validatedData.end_date !== '' ? new Date(validatedData.end_date) : null,
      };
      const [updatedTestPlan] = await db
        .update(testPlans)
        .set({ ...processedData, updated_at: new Date() })
        .where(eq(testPlans.id, id))
        .returning();
      
      if (!updatedTestPlan) {
        return res.status(404).json({ error: "Test plan not found" });
      }
      
      res.json(updatedTestPlan);
    } catch (error) {
      console.error("Error updating test plan:", error);
      res.status(400).json({ error: "Failed to update test plan" });
    }
  });

  app.delete("/api/test-plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedTestPlan] = await db
        .delete(testPlans)
        .where(eq(testPlans.id, id))
        .returning();
      
      if (!deletedTestPlan) {
        return res.status(404).json({ error: "Test plan not found" });
      }
      
      res.json({ message: "Test plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting test plan:", error);
      res.status(500).json({ error: "Failed to delete test plan" });
    }
  });

  // Test plan suites association
  app.post("/api/test-plans/:planId/suites/:suiteId", async (req, res) => {
    try {
      const { planId, suiteId } = req.params;
      const [newAssociation] = await db.insert(testPlanSuites).values({
        test_plan_id: planId,
        test_suite_id: suiteId
      }).returning();
      res.status(201).json(newAssociation);
    } catch (error) {
      console.error("Error associating test suite to plan:", error);
      res.status(400).json({ error: "Failed to associate test suite to plan" });
    }
  });

  app.delete("/api/test-plans/:planId/suites/:suiteId", async (req, res) => {
    try {
      const { planId, suiteId } = req.params;
      await db
        .delete(testPlanSuites)
        .where(
          and(
            eq(testPlanSuites.test_plan_id, planId),
            eq(testPlanSuites.test_suite_id, suiteId)
          )
        );
      res.json({ message: "Test suite removed from plan successfully" });
    } catch (error) {
      console.error("Error removing test suite from plan:", error);
      res.status(500).json({ error: "Failed to remove test suite from plan" });
    }
  });

  // Legacy test executions route - return empty for backward compatibility
  app.get("/api/test-executions", async (req, res) => {
    try {
      res.status(200).json([]);
    } catch (error) {
      console.error("Error in legacy route:", error);
      res.status(500).json({ error: "Legacy route error" });
    }
  });

  // Get test cases for execution within a plan execution
  app.get("/api/test-plan-executions/:id/test-cases", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get execution and related test plan
      const [execution] = await db
        .select({
          execution_id: testPlanExecutions.id,
          test_plan_id: testPlanExecutions.test_plan_id,
          test_suite_id: testPlans.test_suite_id
        })
        .from(testPlanExecutions)
        .leftJoin(testPlans, eq(testPlanExecutions.test_plan_id, testPlans.id))
        .where(eq(testPlanExecutions.id, id));
      
      if (!execution) {
        return res.status(404).json({ error: "Execution not found" });
      }
      
      // Get all test cases from the test suite
      const testCasesInSuite = await db
        .select()
        .from(testCases)
        .where(eq(testCases.test_suite_id, execution.test_suite_id));
      
      // Get existing case executions
      const existingExecutions = await db
        .select()
        .from(testCaseExecutions)
        .where(eq(testCaseExecutions.test_plan_execution_id, id));
      
      // Merge data
      const testCasesWithExecutions = testCasesInSuite.map(testCase => {
        const execution = existingExecutions.find(e => e.test_case_id === testCase.id);
        return {
          ...testCase,
          execution: execution || null
        };
      });
      
      res.json(testCasesWithExecutions);
    } catch (error) {
      console.error("Error fetching test cases for execution:", error);
      res.status(500).json({ error: "Failed to fetch test cases for execution" });
    }
  });

  // Execute individual test case within a plan execution
  app.post("/api/test-case-executions", async (req, res) => {
    try {
      const validatedData = insertTestCaseExecutionSchema.parse(req.body);
      
      // Check if execution already exists for this test case
      const existing = await db
        .select()
        .from(testCaseExecutions)
        .where(
          and(
            eq(testCaseExecutions.test_plan_execution_id, validatedData.test_plan_execution_id),
            eq(testCaseExecutions.test_case_id, validatedData.test_case_id)
          )
        );
      
      if (existing.length > 0) {
        // Update existing execution
        const [updated] = await db
          .update(testCaseExecutions)
          .set({
            ...validatedData,
            execution_date: new Date(),
            updated_at: new Date()
          })
          .where(eq(testCaseExecutions.id, existing[0].id))
          .returning();
        
        res.json(updated);
      } else {
        // Create new execution
        const [newExecution] = await db.insert(testCaseExecutions).values({
          ...validatedData,
          execution_date: new Date()
        }).returning();
        
        res.status(201).json(newExecution);
      }
    } catch (error) {
      console.error("Error executing test case:", error);
      res.status(400).json({ error: "Failed to execute test case" });
    }
  });

  app.put("/api/test-executions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTestExecutionSchema.parse(req.body);
      const [updatedTestExecution] = await db
        .update(testExecutions)
        .set({ ...validatedData, updated_at: new Date() })
        .where(eq(testExecutions.id, id))
        .returning();
      
      if (!updatedTestExecution) {
        return res.status(404).json({ error: "Test execution not found" });
      }
      
      res.json(updatedTestExecution);
    } catch (error) {
      console.error("Error updating test execution:", error);
      res.status(400).json({ error: "Failed to update test execution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
