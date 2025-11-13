import { pool } from "../index.ts";
import { Database } from "../types.ts";

export async function getDatabase(id: string): Promise<Database> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM databases WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't get database : ${e}`);
  } finally {
    client.release();
  }
}
