import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteApplication } from "@coolify/application.ts";

const deleteApplicationRoute = new Hono();

deleteApplicationRoute.delete(
  "/delete-application/:uuid",
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data, error } = await safeAsync(() => deleteApplication(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { deleteApplicationRoute };
