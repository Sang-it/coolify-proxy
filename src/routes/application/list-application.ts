import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { listApplicationByProject } from "@sysdb/application/list-application.ts";

const listApplicationRoute = new Hono();

listApplicationRoute.get("/list-application/:project_id", async (c) => {
  const project_id = c.req.param("project_id");
  const { data, error } = await safeAsync(() =>
    listApplicationByProject(project_id)
  );

  if (error) {
    c.status(500);
    return c.json({ message: error });
  }

  c.status(200);
  return c.json(data);
});

export { listApplicationRoute };
