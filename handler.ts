// handler.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import sqlite3 from "sqlite3";

const EFS_PATH = "./db.sqlite3";

const app = new Hono();

const db = new sqlite3.Database(EFS_PATH);

export async function all<T>(query: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    db.all(query, args, function (err, rows) {
      if (err) return reject(err);
      else resolve(rows as T);
    });
  });
}

async function one<T>(q: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    db.get(q, args, function (err, rows) {
      if (err) return reject(err);
      else resolve(rows as T);
    });
  });
}

async function run(q: string, ...args: any[]): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(q, args, function (err) {
      if (err) return reject(err);
      else resolve(this.lastID);
    });
  });
}

interface Item {
  id: number;
  title: string;
  content: string;
  created_at: string;
  display_start: string;
  display_end: string;
  target_stage: string;
}

// Route to initialize the database
app.get("/init", async (c) => {
  await run(`DROP TABLE IF EXISTS msgs;`);
  const q = /* SQL */ `
    CREATE TABLE msgs (
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
  `;
  await run(q);
  return c.json({ message: "initialized" });
});

// Route to fetch paginated alert messages
app.get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("page") || "25");
  const offset = (page - 1) * limit;
  const q = `SELECT * FROM msgs ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const results = await all<Item[]>(q, limit, offset);
  return c.json(results);
});

// Route to insert a new alert message
app.post("/", async (c) => {
  const { title, message } = await c.req.json();
  const q = "INSERT INTO msgs (title, message) VALUES (?, ?)";
  const id = await run(q, title, message);
  return c.json({ id }, 201);
});

// Route to display the most current alert message based on stage
app.get("/msgs/:stage", async (c) => {
  const stage = c.req.param("stage");
  const q = `
    SELECT title, content FROM msgs
    WHERE target_stage = ?
    AND deleted_at IS NULL
    AND (display_start IS NULL OR display_start <= CURRENT_TIMESTAMP)
    AND (display_end IS NULL OR display_end >= CURRENT_TIMESTAMP)
    ORDER BY created_at DESC
    LIMIT 1;
  `;
  const result = await one<{ title: string; content: string }>(q, stage);
  return c.json(result);
});

// Route to update the alert message and title
app.patch("/msgs/:id", async (c) => {
  const { title, content, created_by } = await c.req.json();
  const id = c.req.param("id");
  const q = "UPDATE msgs SET title = ?, content = ?, created_by = ? WHERE id = ?";
  await run(q, title, content, created_by, id);
  return c.json({ message: "updated" });
});

// Route for logical deletion of an alert
app.delete("/msgs/:id", async (c) => {
  const id = c.req.param("id");
  const q = "UPDATE msgs SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?";
  await run(q, id);
  return c.json({ message: "deleted" });
});

// Route to update display start time
app.patch("/msgs/:id/display", async (c) => {
  const { display_start, display_end } = await c.req.json();
  const id = c.req.param("id");
  const q = "UPDATE msgs SET display_start = ?, display_end = ? WHERE id = ?";
  await run(q, display_start, display_end, id);
  return c.json({ message: "updated" });
});

if (true) {
  console.log(`ready: Listening on http://localhost:3000/`);
  serve({ ...app, port: 3000 });
}

export const handler = handle(app);
