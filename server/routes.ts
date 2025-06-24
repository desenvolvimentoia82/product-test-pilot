import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  products, 
  releases, 
  testSuites, 
  testCases,
  testPlans,
  testPlanSuites,
  testExecutions,
  insertProductSchema, 
  insertReleaseSchema, 
  insertTestSuiteSchema,
  insertTestCaseSchema,
  insertTestPlanSchema,
  insertTestExecutionSchema
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

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
      const { product_id } = req.query;
      let allTestSuites;
      
      if (product_id) {
        allTestSuites = await db
          .select()
          .from(testSuites)
          .where(eq(testSuites.product_id, product_id as string));
      } else {
        allTestSuites = await db.select().from(testSuites);
      }
      
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
      const validatedData = insertTestSuiteSchema.parse(req.body);
      const [updatedTestSuite] = await db
        .update(testSuites)
        .set({ ...validatedData, updated_at: new Date() })
        .where(eq(testSuites.id, id))
        .returning();
      
      if (!updatedTestSuite) {
        return res.status(404).json({ error: "Test suite not found" });
      }
      
      res.json(updatedTestSuite);
    } catch (error) {
      console.error("Error updating test suite:", error);
      res.status(400).json({ error: "Failed to update test suite" });
    }
  });

  app.delete("/api/test-suites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedTestSuite] = await db
        .delete(testSuites)
        .where(eq(testSuites.id, id))
        .returning();
      
      if (!deletedTestSuite) {
        return res.status(404).json({ error: "Test suite not found" });
      }
      
      res.json({ message: "Test suite deleted successfully" });
    } catch (error) {
      console.error("Error deleting test suite:", error);
      res.status(500).json({ error: "Failed to delete test suite" });
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
      const validatedData = insertTestCaseSchema.parse(req.body);
      const [updatedTestCase] = await db
        .update(testCases)
        .set({ ...validatedData, updated_at: new Date() })
        .where(eq(testCases.id, id))
        .returning();
      
      if (!updatedTestCase) {
        return res.status(404).json({ error: "Test case not found" });
      }
      
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
      const { product_id, release_id } = req.query;
      let query = db.select().from(testPlans);
      
      if (product_id) {
        query = query.where(eq(testPlans.product_id, product_id as string));
      }
      if (release_id) {
        query = query.where(eq(testPlans.release_id, release_id as string));
      }
      
      const allTestPlans = await query;
      res.json(allTestPlans);
    } catch (error) {
      console.error("Error fetching test plans:", error);
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });

  app.post("/api/test-plans", async (req, res) => {
    try {
      const validatedData = insertTestPlanSchema.parse(req.body);
      const [newTestPlan] = await db.insert(testPlans).values(validatedData).returning();
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
      const [updatedTestPlan] = await db
        .update(testPlans)
        .set({ ...validatedData, updated_at: new Date() })
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

  // Test executions routes
  app.get("/api/test-executions", async (req, res) => {
    try {
      const { test_plan_id, test_case_id } = req.query;
      let query = db.select().from(testExecutions);
      
      if (test_plan_id) {
        query = query.where(eq(testExecutions.test_plan_id, test_plan_id as string));
      }
      if (test_case_id) {
        query = query.where(eq(testExecutions.test_case_id, test_case_id as string));
      }
      
      const allTestExecutions = await query;
      res.json(allTestExecutions);
    } catch (error) {
      console.error("Error fetching test executions:", error);
      res.status(500).json({ error: "Failed to fetch test executions" });
    }
  });

  app.post("/api/test-executions", async (req, res) => {
    try {
      const validatedData = insertTestExecutionSchema.parse(req.body);
      const [newTestExecution] = await db.insert(testExecutions).values(validatedData).returning();
      res.status(201).json(newTestExecution);
    } catch (error) {
      console.error("Error creating test execution:", error);
      res.status(400).json({ error: "Failed to create test execution" });
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
