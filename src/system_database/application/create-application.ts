import { pool } from "../index.ts";
import { Application } from "../types.ts";

export async function createApplication(
  id: string,
  project_id: string,
  fqdn: string,
): Promise<Application> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO applications (id, project_id, fqdn)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, project_id, fqdn],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't create application : ${e}`);
  } finally {
    client.release();
  }
}
