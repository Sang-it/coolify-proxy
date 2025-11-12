import { Hono } from "hono";
import { deleteProject } from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";

const deleteProjectRoute = new Hono();

deleteProjectRoute.get("/delete-project/:uuid", async (c) => {
  const uuid = c.req.param("uuid");
  const { data, error } = await safeAsync(() => deleteProject(uuid));
  if (error) {
    c.status(404);
    return c.json({ message: error.message });
  }
  c.status(200);
  return c.json(data);
});

export { deleteProjectRoute };
