import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { restartApplication } from "@coolify/application.ts";

const restartApplicationRoute = new Hono();

restartApplicationRoute.post("/restart-application/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => restartApplication(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { restartApplicationRoute };
