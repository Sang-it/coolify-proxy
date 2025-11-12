import z from "zod";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { getUser } from "@sysdb/user/get-user.ts";
import { sendSigninEmail } from "../../email/index.ts";

const signinUserRoute = new Hono();

const ZsigninUser = z.object({
  email: z.email(),
});

signinUserRoute.get(
  "/signin-user/:token",
  async (_) => {
  },
);

signinUserRoute.post(
  "/signin-user",
  async (c) => {
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
    if (jsonError) {
      c.status(422);
      return c.json({ message: jsonError.message });
    }

    const parsed = ZsigninUser.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: user, error: getUserError } = await safeAsync(() =>
      getUser(parsed.data.email)
    );
    if (getUserError) {
      c.status(401);
      return c.json({ message: getUserError });
    }
    if (!user) {
      c.status(401);
      return c.json({ "message": "Unauthorized." });
    }

    const token = await sign({ ...user }, "sangit_was_here");

    const { error: sendEmailError } = await safeAsync(() =>
      sendSigninEmail(parsed.data.email, token)
    );
    if (sendEmailError) {
      c.status(401);
      return c.json({ message: getUserError });
    }

    c.status(200);
    return c.json({ "message": "Email sent." });
  },
);

export { signinUserRoute };
