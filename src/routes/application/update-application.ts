import z from "zod";
import { Hono } from "hono";
import { updateApplication } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";

const updateApplicationRoute = new Hono();

const ZupdateApplication = z.object({
  domains: z.url({ hostname: /(^|\.)caldwellwebservices\.com$/ }),
  git_repository: z.string(),
  project: z.string(),
  git_branch: z.string(),
  ports_exposes: z.string(),
  build_pack: z.enum(["nixpacks", "static", "dockerfile", "dockercompose"]),
});

updateApplicationRoute.post("/update-application", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(422);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZupdateApplication.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  const { data: application, error: updateApplicationError } = await safeAsync(
    () => updateApplication(parsed.data),
  );
  if (updateApplicationError) {
    c.status(422);
    return c.json({ message: updateApplicationError.message });
  }

  return c.json(application);
});

export { updateApplicationRoute };
