import { pool } from "../index.ts";

export async function deleteProject(
  id: string,
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM projects WHERE id = $1`,
      [id],
    );
    return true;
  } catch (e) {
    throw new Error(`Couldn't delete project : ${e}`);
  } finally {
    client.release();
  }
}
