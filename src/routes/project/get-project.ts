import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { getProject } from "@sysdb/project/get-project.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const getProjectRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

getProjectRoute.get(
  "/get-project/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => getProject(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { getProjectRoute };
