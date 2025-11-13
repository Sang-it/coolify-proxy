import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteDatabase as deleteDatabaseCoolify } from "@coolify/database.ts";
import { deleteDatabase as deleteDatabaseEntry } from "@sysdb/database/delete-database.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const deleteDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

deleteDatabaseRoute.delete(
  "/delete-database/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { error: deleteDatabaseCoolifyError } = await safeAsync(() =>
      deleteDatabaseCoolify(uuid)
    );
    if (deleteDatabaseCoolifyError) {
      c.status(404);
      return c.json({ message: deleteDatabaseCoolifyError.message });
    }

    const { data, error } = await safeAsync(() => deleteDatabaseEntry(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error });
    }
    c.status(200);
    return c.json(data);
  },
);

export { deleteDatabaseRoute };
