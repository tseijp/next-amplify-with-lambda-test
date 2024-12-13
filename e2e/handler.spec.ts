import { routes } from "@/handler";
import { test, expect } from "@playwright/test";
import { testClient } from "hono/testing";

const app = testClient(routes);
const iso = new Date().toISOString();
const id = "1";

test.beforeAll("Initialize the database", async () => {
  const res = await app.init.$get();
  expect(res.ok).toBeTruthy();
});

test("List all data", async () => {
  const res = await app.index.$get();
  expect(res.ok).toBeTruthy();
});

test("Insert a new message", async () => {
  const json = { title: "title", content: "content" };
  const res = await app.index.$post({ json });
  expect(res.ok).toBeTruthy();
});

test("Update message title and content", async () => {
  const json = { title: "title", content: "content" };
  const res = await app[":id"].$patch({ param: { id }, json });
  expect(res.ok).toBeTruthy();
});

test("Update display times for an message", async () => {
  const json = { display_start: iso, display_end: iso };
  const res = await app[":id"].display.$patch({ param: { id }, json });
  expect(res.ok).toBeTruthy();
});

test("Update target stage of an message", async () => {
  const json = { target_stage: "release" };
  const res = await app[":id"].target.$patch({ param: { id }, json });
  expect(res.ok).toBeTruthy();
});

test("Logically delete an message", async () => {
  const res = await app[":id"].$delete({ param: { id } });
  expect(res.ok).toBeTruthy();
});

const stages = ["develop", "release", "product"];

stages.forEach((stage) => {
  test(`Retrieve message for ${stage} stage`, async () => {
    const res = await app[":stage"].$get({ param: { stage } });
    expect(res.ok).toBeTruthy();
  });
});
