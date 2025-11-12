import { pool } from "../index.ts";
import { User } from "../types.ts";

export async function createUser(email: string): Promise<User> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (email)
       VALUES ($1)
       RETURNING *`,
      [email],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't create user : ${e}`);
  } finally {
    client.release();
  }
}
