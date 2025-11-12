import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteUser } from "@sysdb/user/delete-user.ts";

const deleteUserRoute = new Hono();

deleteUserRoute.delete(
  "/delete-user/:id",
  async (c) => {
    const id = c.req.param("id");
    const { data, error } = await safeAsync(() => deleteUser(id));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { deleteUserRoute };
