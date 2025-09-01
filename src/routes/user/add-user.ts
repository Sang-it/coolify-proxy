import z from "zod";
import { Hono } from "hono";
import { USER } from "@db/user.ts";
import { safeAsync } from "@utils/safe-async.ts";

const addUserRoute = new Hono();

const ZaddEmail = z.object({
  email: z.email(),
});

addUserRoute.post("/add-user", async (c) => {
  const { data: body, error } = await safeAsync(() => c.req.json());
  if (error) {
    c.status(422);
    return c.json({ message: error.message });
  }

  const parsed = ZaddEmail.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: parsed.error.message });
  }
  const { email } = parsed.data;
  const alreadyExists = USER.data.allowedEmails.includes(email);
  if (alreadyExists) {
    c.status(409);
    return c.json({ message: "Email already exists." });
  }
  await USER.update(({ allowedEmails }) => allowedEmails.push(email));
  c.status(200);
  return c.json({ message: "User create successfull." });
});

const ZaddEmails = z.object({
  emails: z.array(
    z.email(),
  ),
});

addUserRoute.post("/add-users", async (c) => {
  const { data: body, error } = await safeAsync(() => c.req.json());
  if (error) {
    c.status(422);
    return c.json({ message: error.message });
  }

  const parsed = ZaddEmails.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: parsed.error.message });
  }
  const { emails } = parsed.data;
  const candidates = [...new Set(emails)].filter(
    (email) => !USER.data.allowedEmails.includes(email),
  );

  const alreadyExists = candidates.length == 0;
  if (alreadyExists) {
    c.status(409);
    return c.json({
      message: "Emails already exist.",
    });
  }

  await USER.update(({ allowedEmails }) => allowedEmails.push(...candidates));

  const hasConflicts = candidates.length < emails.length;
  if (hasConflicts) {
    c.status(200);
    return c.json({
      message:
        "Users create successfull.\n Some emails were omitted because they already exist.",
    });
  }

  c.status(200);
  return c.json({ message: "Users add successfully." });
});

export { addUserRoute };
