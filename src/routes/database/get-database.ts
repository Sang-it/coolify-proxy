import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { getDatabase } from "@sysdb/database/get-database.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const getDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

getDatabaseRoute.get(
  "/get-database/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => getDatabase(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { getDatabaseRoute };
