import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  createApplication as createApplicationCoolify,
  deleteApplication,
} from "@coolify/application.ts";
import { createApplication as createApplicationEntry } from "@sysdb/application/create-application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const createApplicationRoute = new Hono();

const ZcreateApplication = z.object({
  domains: z.url({ hostname: /(^|\.)caldwellwebservices\.com$/ }),
  git_repository: z.string(),
  project_uuid: z.string(),
  git_branch: z.string(),
  ports_exposes: z.string(),
  build_pack: z.enum(["nixpacks", "static", "dockerfile", "dockercompose"]),
});

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

    const parsed = ZcreateApplication.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: applicationCoolify, error: createApplicationErrorCoolify } =
      await safeAsync(
        () => createApplicationCoolify(parsed.data),
      );

    if (createApplicationErrorCoolify) {
      c.status(422);
      return c.json({ message: createApplicationErrorCoolify.message });
    }

    const { data: applicationEntry, error: createApplicationErrorEntry } =
      await safeAsync(
        () =>
          createApplicationEntry(
            applicationCoolify.uuid,
            parsed.data.project_uuid,
            parsed.data.domains,
          ),
      );

    if (createApplicationErrorEntry) {
      const { error: deleteApplicationError } = await safeAsync(
        () => deleteApplication(applicationCoolify.uuid),
      );

      if (deleteApplicationError) {
        c.status(422);
        return c.json({ message: deleteApplicationError.message });
      }

      c.status(422);
      return c.json({ message: createApplicationErrorEntry.message });
    }

    return c.json(applicationEntry);
  },
);

export { createApplicationRoute };
