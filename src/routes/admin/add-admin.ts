import z from "zod";
import { Hono } from "hono";
import { ADMIN } from "@db/admin.ts";
import { safeAsync } from "@utils/safe-async.ts";

const addAdminRoute = new Hono();

const ZaddEmail = z.object({
  email: z.email(),
});

addAdminRoute.post("/add-admin", async (c) => {
  const { data: body, error } = await safeAsync(() => c.req.json());
  if (error) {
    c.status(422);
    return c.text(error.message);
  }

  const parsed = ZaddEmail.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.text(parsed.error.message);
  }
  const { email } = parsed.data;
  const alreadyExists = ADMIN.data.allowedEmails.includes(email);
  if (alreadyExists) {
    c.status(409);
    return c.text("Email already exists.");
  }
  await ADMIN.update(({ allowedEmails }) => allowedEmails.push(email));
  c.status(200);
  return c.text("Admin create successfull.");
});

export { addAdminRoute };
