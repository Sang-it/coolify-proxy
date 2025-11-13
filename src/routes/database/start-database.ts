import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { startDatabase } from "@coolify/database.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const startDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

startDatabaseRoute.post(
  "/start-database/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => startDatabase(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { startDatabaseRoute };
