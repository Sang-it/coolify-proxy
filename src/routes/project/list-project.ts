import { Hono } from "hono";
import { listProject } from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";

const listProjectRoute = new Hono();

listProjectRoute.get("/list-project", async (c) => {
  const { data, error } = await safeAsync(() => listProject());
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { listProjectRoute };
