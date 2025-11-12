import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { startDatabase } from "@coolify/database.ts";

const startDatabaseRoute = new Hono();

startDatabaseRoute.post("/start-database/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => startDatabase(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { startDatabaseRoute };
