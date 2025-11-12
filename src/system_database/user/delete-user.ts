import { pool } from "../index.ts";

export async function deleteUser(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM users WHERE id = $1`,
      [id],
    );
    return true;
  } catch (e) {
    throw new Error(`Couldn't delete user : ${e}`);
  } finally {
    client.release();
  }
}
