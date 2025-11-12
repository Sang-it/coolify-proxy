import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { _truncateDb } from "@sysdb/util.ts";

const _truncateDbRoute = new Hono();

_truncateDbRoute.delete(
  "/truncate-db",
  async (c) => {
    const { data, error } = await safeAsync(() => _truncateDb());
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { _truncateDbRoute };
