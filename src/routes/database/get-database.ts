import { Hono } from "hono";
import { getDatabase } from "@coolify/database.ts";
import { safeAsync } from "@utils/safe-async.ts";

const getDatabaseRoute = new Hono();

getDatabaseRoute.get("/get-database/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => getDatabase(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { getDatabaseRoute };
