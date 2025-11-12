import { Hono } from "hono";
import { listDatabase } from "@coolify/database.ts";
import { safeAsync } from "@utils/safe-async.ts";

const listDatabaseRoute = new Hono();

listDatabaseRoute.get("/list-database", async (c) => {
  const { data, error } = await safeAsync(() => listDatabase());
  if (error) {
    c.status(500);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { listDatabaseRoute };
