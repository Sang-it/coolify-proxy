import z from "zod";
import { Hono } from "hono";
import { createApplication } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";

const createApplicationRoute = new Hono();

const ZcreateApplication = z.object({
  domains: z.url({ hostname: /(^|\.)caldwellwebservices\.com$/ }),
  git_repository: z.string(),
  project_uuid: z.string(),
  git_branch: z.string(),
  ports_exposes: z.string(),
  build_pack: z.enum(["nixpacks", "static", "dockerfile", "dockercompose"]),
});

createApplicationRoute.post("/create-application", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(422);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZcreateApplication.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  const { data: application, error: createApplicationError } = await safeAsync(
    () => createApplication(parsed.data),
  );
  if (createApplicationError) {
    c.status(422);
    return c.json({ message: createApplicationError.message });
  }

  return c.json(application);
});

export { createApplicationRoute };
