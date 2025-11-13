import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { listDatabaseByProject } from "@sysdb/database/list-database.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const listDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

listDatabaseRoute.get(
  "/list-database/:project_id",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const project_id = c.req.param("project_id");
    const { data, error } = await safeAsync(() =>
      listDatabaseByProject(project_id)
    );
    if (error) {
      c.status(500);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { listDatabaseRoute };
