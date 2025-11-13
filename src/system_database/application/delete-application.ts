import { pool } from "../index.ts";

export async function deleteApplication(
  id: string,
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM applications WHERE id = $1`,
      [id],
    );
    return true;
  } catch (e) {
    throw new Error(`Couldn't delete application : ${e}`);
  } finally {
    client.release();
  }
}
