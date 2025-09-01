import { Hono } from "hono";
import { getApplication } from "@coolify/index.ts";
import { safeAsync } from "@utils/safe-async.ts";

const getApplicationRoute = new Hono();

getApplicationRoute.post("/get-application/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => getApplication(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { getApplicationRoute };
