import z from "zod";
import { Hono } from "hono";
import { addApplication, deployApplication } from "@coolify/index.ts";
import { safeAsync } from "@utils/safe-async.ts";

const addApplicationRoute = new Hono();

const ZaddApplication = z.object({
  domains: z.string(),
  gitRepository: z.string(),
});

addApplicationRoute.post("/add-application", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(422);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZaddApplication.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: parsed.error.message });
  }

  const { data: application, error: addApplicationError } = await safeAsync(
    () => addApplication(parsed.data),
  );
  if (addApplicationError) {
    c.status(422);
    return c.json({ message: addApplicationError.message });
  }

  const { data: deploymentData, error: deployApplicationError } =
    await safeAsync(
      () => deployApplication(application),
    );
  if (deployApplicationError) {
    c.status(422);
    return c.json({ message: deployApplicationError.message });
  }

  c.status(200);
  return c.json(deploymentData);
});

export { addApplicationRoute };
