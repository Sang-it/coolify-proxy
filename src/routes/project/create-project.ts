import z from "zod";
import { Hono } from "hono";
import { createProject } from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";

const createProjectRoute = new Hono();

const ZcreateProject = z.object({
  name: z.string(),
});

createProjectRoute.post("/create-project", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(422);
    return c.json({ message: jsonError.message });
  }

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
});

export { createProjectRoute };
