import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { stopDatabase } from "@coolify/database.ts";

const stopDatabaseRoute = new Hono();

stopDatabaseRoute.post("/stop-Database/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => stopDatabase(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { stopDatabaseRoute };
