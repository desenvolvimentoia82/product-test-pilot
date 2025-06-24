import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { products, releases, testSuites, insertProductSchema, insertReleaseSchema, insertTestSuiteSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

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

  const httpServer = createServer(app);
  return httpServer;
}
