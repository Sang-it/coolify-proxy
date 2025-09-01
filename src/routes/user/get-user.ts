import { Hono } from "hono";
import { USER } from "@db/user.ts";

const getUserRoute = new Hono();

getUserRoute.get("/get-user", (c) => {
  const users = USER.data.currentUsers;
  c.status(200);
  return c.json(users);
});

getUserRoute.get("/get-user/:email", (c) => {
  const email = c.req.param("email");
  const user = USER.data.currentUsers.filter((_user) => _user.email === email);
  if (user.length == 0) {
    c.status(404);
    return c.json({ message: `User with email: ${email} not found.` });
  }

  c.status(200);
  return c.json(user);
});

export { getUserRoute };
