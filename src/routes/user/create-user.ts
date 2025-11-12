import z from "zod";
import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { createUser } from "@sysdb/user/create-user.ts";

const createUserRoute = new Hono();

const ZcreateUser = z.object({
  email: z.email(),
});

createUserRoute.post("/create-user", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(422);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZcreateUser.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  const { data: user, error: createUserError } = await safeAsync(
    () => createUser(parsed.data.email),
  );
  if (createUserError) {
    c.status(422);
    return c.json({ message: createUserError.message });
  }

  c.status(200);
  return c.json(user);
});

export { createUserRoute };
