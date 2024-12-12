// amplify/handler.mjs
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import sqlite3 from "sqlite3";

const EFS_PATH = "/mnt/efs/db.sqlite3";

const app = new Hono();

const db = new sqlite3.Database(EFS_PATH);

app.get("/", (c) => c.text("Hello Hono!"));

app.get("/init", (c) => {
  return c.text("Success" + db);
});

export const handler = handle(app);
