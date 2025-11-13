import { pool } from "../index.ts";
import { Application } from "../types.ts";

export async function getApplication(id: string): Promise<Application> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM applications WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't get application : ${e}`);
  } finally {
    client.release();
  }
}
