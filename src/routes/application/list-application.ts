import { Hono } from "hono";
import { listApplication } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";

const listApplicationRoute = new Hono();

listApplicationRoute.get("/list-application", async (c) => {
  const { data, error } = await safeAsync(() => listApplication());
  if (error) {
    c.status(500);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { listApplicationRoute };
