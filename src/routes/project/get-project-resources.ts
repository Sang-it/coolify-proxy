import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { getProjectResources } from "@coolify/project.ts";

const getProjectResourcesRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

getProjectResourcesRoute.get(
  "/get-project-resources/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => getProjectResources(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { getProjectResourcesRoute };
