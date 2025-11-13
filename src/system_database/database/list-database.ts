import { pool } from "../index.ts";
import { Database } from "../types.ts";

export async function listDatabase(): Promise<Database[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM databases`,
    );
    return result.rows as Database[];
  } catch (e) {
    throw new Error(`Couldn't list database : ${e}`);
  } finally {
    client.release();
  }
}

export async function listDatabaseByProject(
  project_id: string,
): Promise<Database[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM databases WHERE project_id = $1`,
      [project_id],
    );
    return result.rows as Database[];
  } catch (e) {
    throw new Error(`Couldn't list database : ${e}`);
  } finally {
    client.release();
  }
}
