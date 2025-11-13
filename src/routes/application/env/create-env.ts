import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createEnv } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const createEnvRoute = new Hono();

const ZcreateEnv = z.object({
  key: z.string(),
  value: z.string(),
});

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createEnvRoute.post(
  "/create-env/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
    if (jsonError) {
      c.status(422);
      return c.json({ message: jsonError.message });
    }

    const parsed = ZcreateEnv.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: env, error: createEnvError } = await safeAsync(
      () => createEnv(uuid, parsed.data),
    );
    if (createEnvError) {
      c.status(422);
      return c.json({ message: createEnvError.message });
    }

    return c.json(env);
  },
);

export { createEnvRoute };
