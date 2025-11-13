import { pool } from "../index.ts";
import { Application } from "../types.ts";

export async function listApplication(): Promise<Application[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM applications`,
    );
    return result.rows as Application[];
  } catch (e) {
    throw new Error(`Couldn't list application : ${e}`);
  } finally {
    client.release();
  }
}

export async function listApplicationByProject(
  project_id: string,
): Promise<Application[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM applications WHERE project_id = $1`,
      [project_id],
    );
    return result.rows as Application[];
  } catch (e) {
    throw new Error(`Couldn't list application : ${e}`);
  } finally {
    client.release();
  }
}
