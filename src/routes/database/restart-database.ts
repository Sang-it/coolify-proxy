import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { restartDatabase } from "@coolify/database.ts";

const restartDatabaseRoute = new Hono();

restartDatabaseRoute.post("/restart-database/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => restartDatabase(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { restartDatabaseRoute };
