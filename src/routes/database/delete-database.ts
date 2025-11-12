import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteDatabase } from "@coolify/database.ts";

const deleteDatabaseRoute = new Hono();

deleteDatabaseRoute.delete(
  "/delete-database/:uuid",
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => deleteDatabase(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { deleteDatabaseRoute };
