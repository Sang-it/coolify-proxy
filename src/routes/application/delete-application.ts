import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteApplication as deleteApplicationCoolify } from "@coolify/application.ts";
import { deleteApplication as deleteApplicationEntry } from "@sysdb/application/delete-application.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const deleteApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

deleteApplicationRoute.delete(
  "/delete-application/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { error: deleteApplicationCoolifyError } = await safeAsync(() =>
      deleteApplicationCoolify(uuid)
    );
    if (deleteApplicationCoolifyError) {
      c.status(404);
      return c.json({ message: deleteApplicationCoolifyError.message });
    }

    const { error } = await safeAsync(() => deleteApplicationEntry(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error });
    }

    c.status(200);
    return c.text("OK");
  },
);

export { deleteApplicationRoute };
