import { pool } from "../index.ts";

export async function deleteDatabase(
  id: string,
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM databases WHERE id = $1`,
      [id],
    );
    return true;
  } catch (e) {
    throw new Error(`Couldn't delete database : ${e}`);
  } finally {
    client.release();
  }
}
