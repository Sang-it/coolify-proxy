import z from "zod";
import { Hono } from "hono";
import {
  createDatabaseMongoDB,
  createDatabasePostgreSQL,
  createDatabaseRedis,
} from "@coolify/database.ts";
import { safeAsync } from "@utils/safe-async.ts";

const createDatabaseRoute = new Hono();

const ZcreateDatabase = z.object({
  kind: z.enum(["mongodb", "redis", "postgresql"]),
  project_uuid: z.string(),
});

createDatabaseRoute.post("/create-database", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(422);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZcreateDatabase.safeParse(body);
  if (!parsed.success) {
    c.status(422);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  switch (parsed.data.kind) {
    case "mongodb": {
      const { data: database, error: createDatabaseError } = await safeAsync(
        () => createDatabaseMongoDB(parsed.data.project_uuid),
      );
      if (createDatabaseError) {
        c.status(422);
        return c.json({ message: createDatabaseError.message });
      }

      return c.json(database);
    }

    case "postgresql": {
      const { data: database, error: createDatabaseError } = await safeAsync(
        () => createDatabasePostgreSQL(parsed.data.project_uuid),
      );

      if (createDatabaseError) {
        c.status(422);
        return c.json({ message: createDatabaseError.message });
      }

      return c.json(database);
    }

    case "redis": {
      const { data: database, error: createDatabaseError } = await safeAsync(
        () => createDatabaseRedis(parsed.data.project_uuid),
      );

      if (createDatabaseError) {
        c.status(422);
        return c.json({ message: createDatabaseError.message });
      }

      return c.json(database);
    }
  }
});

export { createDatabaseRoute };
