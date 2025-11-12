import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { listUser } from "@sysdb/user/list-user.ts";

const listUserRoute = new Hono();

listUserRoute.get("/list-user", async (c) => {
  const { data: user, error: listUserError } = await safeAsync(
    () => listUser(),
  );
  if (listUserError) {
    c.status(422);
    return c.json({ message: listUserError.message });
  }

  c.status(200);
  return c.json(user);
});

export { listUserRoute };
