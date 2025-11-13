import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  createDatabaseMongoDB,
  createDatabasePostgreSQL,
  createDatabaseRedis,
  deleteDatabase,
} from "@coolify/database.ts";
import { createDatabase as createDatabaseEntry } from "@sysdb/database/create-database.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const createDatabaseRoute = new Hono();

const ZcreateDatabase = z.object({
  kind: z.enum(["mongodb", "redis", "postgresql"]),
  project_uuid: z.string(),
});

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createDatabaseRoute.post(
  "/create-database",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
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
        const { data: databaseCoolify, error: createDatabaseErrorCoolify } =
          await safeAsync(
            () => createDatabaseMongoDB(parsed.data.project_uuid),
          );
        if (createDatabaseErrorCoolify) {
          c.status(422);
          return c.json({ message: createDatabaseErrorCoolify.message });
        }

        const { data: databaseEntry, error: createDatabaseErrorEntry } =
          await safeAsync(
            () =>
              createDatabaseEntry(
                databaseCoolify.uuid,
                parsed.data.project_uuid,
                parsed.data.kind,
                databaseCoolify.internal_db_url,
              ),
          );

        if (createDatabaseErrorEntry) {
          const { error: deleteDatabaseError } = await safeAsync(
            () => deleteDatabase(databaseCoolify.uuid),
          );
          if (deleteDatabaseError) {
            c.status(422);
            return c.json({ message: deleteDatabaseError });
          }
          c.status(422);
          return c.json({ message: createDatabaseErrorEntry });
        }

        return c.json(databaseEntry);
      }

      case "postgresql": {
        const { data: databaseCoolify, error: createDatabaseErrorCoolify } =
          await safeAsync(
            () => createDatabasePostgreSQL(parsed.data.project_uuid),
          );

        if (createDatabaseErrorCoolify) {
          c.status(422);
          return c.json({ message: createDatabaseErrorCoolify.message });
        }

        const { data: databaseEntry, error: createDatabaseErrorEntry } =
          await safeAsync(
            () =>
              createDatabaseEntry(
                databaseCoolify.uuid,
                parsed.data.project_uuid,
                parsed.data.kind,
                databaseCoolify.internal_db_url,
              ),
          );

        if (createDatabaseErrorEntry) {
          const { error: deleteDatabaseError } = await safeAsync(
            () => deleteDatabase(databaseCoolify.uuid),
          );
          if (deleteDatabaseError) {
            c.status(422);
            return c.json({ message: deleteDatabaseError });
          }
          c.status(422);
          return c.json({ message: createDatabaseErrorEntry });
        }

        return c.json(databaseEntry);
      }

      case "redis": {
        const { data: databaseCoolify, error: createDatabaseErrorCoolify } =
          await safeAsync(
            () => createDatabaseRedis(parsed.data.project_uuid),
          );

        if (createDatabaseErrorCoolify) {
          c.status(422);
          return c.json({ message: createDatabaseErrorCoolify.message });
        }

        const { data: databaseEntry, error: createDatabaseErrorEntry } =
          await safeAsync(
            () =>
              createDatabaseEntry(
                databaseCoolify.uuid,
                parsed.data.project_uuid,
                parsed.data.kind,
                databaseCoolify.internal_db_url,
              ),
          );

        if (createDatabaseErrorEntry) {
          const { error: deleteDatabaseError } = await safeAsync(
            () => deleteDatabase(databaseCoolify.uuid),
          );
          if (deleteDatabaseError) {
            c.status(422);
            return c.json({ message: deleteDatabaseError });
          }
          c.status(422);
          return c.json({ message: createDatabaseErrorEntry });
        }

        return c.json(databaseEntry);
      }
    }
  },
);

export { createDatabaseRoute };
