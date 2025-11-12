import { Hono } from "hono";
import { getProject } from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";

const getProjectRoute = new Hono();

getProjectRoute.get("/get-project/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => getProject(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { getProjectRoute };
