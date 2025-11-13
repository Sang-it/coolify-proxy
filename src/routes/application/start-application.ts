import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { startApplication } from "@coolify/application.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const startApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

startApplicationRoute.post(
  "/start-application/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => startApplication(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { startApplicationRoute };
