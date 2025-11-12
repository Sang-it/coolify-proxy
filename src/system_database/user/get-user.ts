import { pool } from "../index.ts";
import { User } from "../types.ts";

export async function getUser(email: string): Promise<User> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't get user : ${e}`);
  } finally {
    client.release();
  }
}
