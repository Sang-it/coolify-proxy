import { Hono } from "hono";
import { deleteEnv } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";

const deleteEnvRoute = new Hono();

deleteEnvRoute.delete("/delete-env/:app_uuid/:env_uuid", async (c) => {
  const app_uuid = c.req.param("app_uuid");
  const env_uuid = c.req.param("env_uuid");

  const { data: env, error: deleteEnvError } = await safeAsync(
    () => deleteEnv(app_uuid, env_uuid),
  );
  if (deleteEnvError) {
    c.status(422);
    return c.json({ message: deleteEnvError.message });
  }

  return c.json(env);
});

export { deleteEnvRoute };
