import { Context } from "hono";

const secret = "sangit_was_here";

export const adminToken = (token: string, _: Context) => {
  return token == secret;
};
