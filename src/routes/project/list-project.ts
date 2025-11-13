import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { User } from "@sysdb/types.ts";
import { listProjectByUser } from "@sysdb/project/list-project.ts";

const listProjectRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

listProjectRoute.get(
  "/list-project",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    // @ts-expect-error : <>
    const payload = c.get("jwtPayload") as unknown as User;
    const { data, error } = await safeAsync(() =>
      listProjectByUser(payload.id)
    );
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { listProjectRoute };
