import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { stopApplication } from "@coolify/application.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const stopApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

stopApplicationRoute.post(
  "/stop-application/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => stopApplication(uuid));
    if (error) {
      c.status(500);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { stopApplicationRoute };
