import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { stopApplication } from "@coolify/application.ts";

const stopApplicationRoute = new Hono();

stopApplicationRoute.post("/stop-application/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => stopApplication(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { stopApplicationRoute };
