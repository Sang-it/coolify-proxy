import { pool } from "../index.ts";
import { Database } from "../types.ts";

export async function createDatabase(
  id: string,
  project_id: string,
  engine: string,
  connection_url: string,
): Promise<Database> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO databases (id, project_id, engine, connection_url )
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, project_id, engine, connection_url],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't create database : ${e}`);
  } finally {
    client.release();
  }
}
