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
import { ZMongo, ZPostgreSQL, ZRedis } from "@coolify/types.ts";

const createDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createDatabaseRoute.post(
  "/create-database-mongodb",
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

    const parsed = ZMongo.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: databaseCoolify, error: createDatabaseErrorCoolify } =
      await safeAsync(
        () => createDatabaseMongoDB(parsed.data),
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
            "mongodb",
            databaseCoolify.internal_db_url,
          ),
      );

    if (createDatabaseErrorEntry) {
      const { error: deleteDatabaseError } = await safeAsync(
        () => deleteDatabase(databaseCoolify.uuid),
      );
      if (deleteDatabaseError) {
        c.status(422);
        return c.json({
          message: deleteDatabaseError,
          _info: `Contact Admin. Dangling db - ${databaseCoolify.uuid}`,
        });
      }
      c.status(422);
      return c.json({ message: createDatabaseErrorEntry });
    }

    return c.json(databaseEntry);
  },
);

createDatabaseRoute.post(
  "/create-database-postgres",
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

    const parsed = ZPostgreSQL.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: databaseCoolify, error: createDatabaseErrorCoolify } =
      await safeAsync(
        () => createDatabasePostgreSQL(parsed.data),
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
            "postgresql",
            databaseCoolify.internal_db_url,
          ),
      );

    if (createDatabaseErrorEntry) {
      const { error: deleteDatabaseError } = await safeAsync(
        () => deleteDatabase(databaseCoolify.uuid),
      );
      if (deleteDatabaseError) {
        c.status(422);
        return c.json({
          message: deleteDatabaseError,
          _info: `Contact Admin. Dangling db - ${databaseCoolify.uuid}`,
        });
      }
      c.status(422);
      return c.json({ message: createDatabaseErrorEntry });
    }

    return c.json(databaseEntry);
  },
);

createDatabaseRoute.post(
  "/create-database-redis",
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

    const parsed = ZRedis.safeParse(body);
    if (!parsed.success) {
      c.status(422);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: databaseCoolify, error: createDatabaseErrorCoolify } =
      await safeAsync(
        () => createDatabaseRedis(parsed.data),
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
            "redis",
            databaseCoolify.internal_db_url,
          ),
      );

    if (createDatabaseErrorEntry) {
      const { error: deleteDatabaseError } = await safeAsync(
        () => deleteDatabase(databaseCoolify.uuid),
      );
      if (deleteDatabaseError) {
        c.status(422);
        return c.json({
          message: deleteDatabaseError,
          _info: `Contact Admin. Dangling db - ${databaseCoolify.uuid}`,
        });
      }
      c.status(422);
      return c.json({ message: createDatabaseErrorEntry });
    }

    return c.json(databaseEntry);
  },
);

export { createDatabaseRoute };
