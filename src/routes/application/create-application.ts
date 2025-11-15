import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createApplication } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { ZApplication } from "@coolify/types.ts";

const createApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createApplicationRoute.post(
  "/create-application",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
    if (jsonError) {
      c.status(422);
      return c.json({ message: jsonError.message });
    }

    const parsed = ZApplication.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: application, error: createApplicationError } =
      await safeAsync(
        () => createApplication(parsed.data),
      );

    if (createApplicationError) {
      c.status(422);
      return c.json({ message: createApplicationError.message });
    }

    return c.json(application);
  },
);

export { createApplicationRoute };
