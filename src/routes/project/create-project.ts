import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createProject } from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const createProjectRoute = new Hono();

const ZcreateProject = z.object({
  name: z.string(),
});

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createProjectRoute.post(
  "/create-project",
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

    // @ts-expect-error: <I will type this later>
    const payload = c.get("jwtPayload");
    console.log(payload);

    const parsed = ZcreateProject.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: projectData, error: createProjectError } = await safeAsync(
      () => createProject(parsed.data.name),
    );
    if (createProjectError) {
      c.status(422);
      return c.json({ message: createProjectError.message });
    }

    c.status(200);
    return c.json(projectData);
  },
);

export { createProjectRoute };
