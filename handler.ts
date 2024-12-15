// handler.ts
import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import sqlite3 from "sqlite3";
import { all, one, run } from "./utils";
import { z } from "zod";

const isLocal = process.env.RUNTIME_ENV === "local";
const isServe = process.env.RUNTIME_ENV === "serve";
const DB_PATH = isLocal || isServe ? "./db.sqlite3" : "/mnt/db/db.sqlite";

export const app = new Hono();

export const db = new sqlite3.Database(DB_PATH);

interface Item {
  id: number;
  title: string;
  content: string;
  display_start: string;
  display_end: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  target_stage: string;
}

const tableCreationQuery = /* SQL */ `
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  display_start DATETIME,
  display_end DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  created_by TEXT,
  target_stage TEXT DEFAULT 'develop'
);
`.trim();

const createSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const updateSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const updateAuthorSchema = z.object({
  created_by: z.string(),
});

const updateDisplaySchema = z.object({
  display_start: z.string(),
  display_end: z.string(),
});

const updateTargetSchema = z.object({
  target_stage: z.string(),
});

// Route to initialize the database
export const routes = app
  .get("/init", async (c) => {
    await run(tableCreationQuery);
    return c.json({ message: "inited" });
  })
  // @TODO REMOVE
  .get("/drop", async (c) => {
    await run(/* SQL */ `DROP TABLE IF EXISTS items;`);
    return c.json({ message: "droped" });
  })
  // get to fetch paginated alert messages
  .get("/", async (c) => {
    const page = parseInt(c.req.query("page") || "1");
    const limit = 10;
    const q = /* SQL */ `SELECT * FROM items ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const res = await all<Item[]>(q, limit, limit * (page - 1));
    return c.json(res);
  })
  // insert a new alert message
  .post("/", zValidator("json", createSchema), async (c) => {
    const { title, content } = c.req.valid("json");
    const q = /* SQL */ `INSERT INTO items (title, content) VALUES (?, ?)`;
    const id = await run(q, title, content);
    return c.json({ id }, 201);
  })
  // get specific alert message
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const q = /* SQL */ `SELECT * FROM items WHERE id = ?`;
    const res = await one<Item>(q, id);
    return c.json(res);
  })
  // update the alert message and title
  .patch("/:id", zValidator("json", updateSchema), async (c) => {
    const { title, content } = await c.req.json();
    const id = c.req.param("id");
    const q = /* SQL */ `UPDATE items SET title = ?, content = ? WHERE id = ?`;
    await run(q, title, content, id);
    return c.json({ message: "updated" });
  })
  // delete for logical deletion of an alert
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const q = /* SQL */ `UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await run(q, id);
    return c.json({ message: "deleted" });
  })
  // update author
  .patch("/:id/author", zValidator("json", updateAuthorSchema), async (c) => {
    const { created_by } = c.req.valid("json");
    const id = c.req.param("id");
    const q = /* SQL */ `UPDATE items SET created_by = ? WHERE id = ?`;
    await run(q, created_by, id);
    return c.json({ message: "updated" });
  })
  // update target stage
  .patch("/:id/target", zValidator("json", updateTargetSchema), async (c) => {
    const { target_stage } = c.req.valid("json");
    const id = c.req.param("id");
    const q = /* SQL */ `UPDATE items SET target_stage = ? WHERE id = ?`;
    await run(q, target_stage, id);
    return c.json({ message: "updated" });
  })
  // update display start time
  .patch("/:id/display", zValidator("json", updateDisplaySchema), async (c) => {
    const { display_start, display_end } = c.req.valid("json");
    const id = c.req.param("id");
    const q = /* SQL */ `UPDATE items SET display_start = ?, display_end = ? WHERE id = ?`;
    await run(q, display_start, display_end, id);
    return c.json({ message: "updated" });
  })
  // get to display the most current alert message based on stage
  .get("/stage/:stage", async (c) => {
    const stage = c.req.param("stage");
    const query = /* SQL */ `
      SELECT title, content FROM items
      WHERE target_stage = ?
      AND deleted_at IS NULL
      AND (display_start IS NULL OR display_start <= CURRENT_TIMESTAMP)
      AND (display_end IS NULL OR display_end >= CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const res = await one<{ title: string; content: string }>(query, stage);
    return c.json(res ?? {});
  });

if (isServe) {
  console.log(`ready: Listening on http://localhost:3001/`);
  serve({ ...app, port: 3001 });
}

export type AppType = typeof routes;

export const handler = handle(app);
