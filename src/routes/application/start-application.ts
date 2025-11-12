import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { startApplication } from "@coolify/application.ts";

const startApplicationRoute = new Hono();

startApplicationRoute.post("/start-application/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => startApplication(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { startApplicationRoute };
