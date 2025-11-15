import { pool } from "../index.ts";

export async function deleteApplication(
  id: string,
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM applications WHERE id = $1`,
      [id],
    );
  } catch (e) {
    throw new Error(`Couldn't delete application : ${e}`);
  } finally {
    client.release();
  }
}
