import { Hono } from "hono";
import { listEnv } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";

const listEnvRoute = new Hono();

listEnvRoute.get("/list-env/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => listEnv(uuid));
  if (error) {
    c.status(500);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { listEnvRoute };
