import { test, expect } from '@playwright/test';

const url = "http://localhost:3000";
const iso = new Date().toISOString()
const id = 1

test("Initialize the database", async ({ request }) => {
  const res = await request.post(`${url}/init`);
  expect(res.ok()).toBeTruthy();
});

test("insert a new alert message", async ({ request }) => {
  const data = { title: "a", message: "b", created_by: "c" };
  const res = await request.post(url, { data });
  expect(res.ok()).toBeTruthy();
});

test("Update display times for an alert message", async ({ request }) => {
  // Assuming 'id' is known from a previous test or setup
  const data = { display_start: iso, display_end: iso };
  const response = await request.patch(`${url}/msgs/${id}/display`, { data });
  expect(response.ok()).toBeTruthy();
});

test("Update alert message title and content", async ({ request }) => {
  const data = { title: "Updated Title", content: "Updated content" };
  const res = await request.patch(`${url}/msgs/${id}`, { data });
  expect(res.ok()).toBeTruthy();
});

test("Update target stage of an alert message", async ({ request }) => {
  const data = { target_stage: "release" }; // Changing to release stage
  const res = await request.patch(`${url}/msgs/${id}`, { data });
  expect(res.ok()).toBeTruthy();
});

test("Logically delete an alert message", async ({ request }) => {
  const res = await request.delete(`${url}/msgs/${id}`);
  expect(res.ok()).toBeTruthy();
});

const stages = ["develop", "release", "product"];

stages.forEach((stage) => {
  test(`Retrieve alert message for ${stage} stage`, async ({ request }) => {
    const res = await request.get(`${url}/msgs/${stage}`);
    expect(res.ok()).toBeTruthy();
  });
});