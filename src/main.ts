import "dotenv/config";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { getUserRoute } from "@routes/user/get-user.ts";
import { addUserRoute } from "@routes/user/add-user.ts";
import { addAdminRoute } from "@routes/admin/add-admin.ts";
import { adminVerifyToken } from "@middleware/auth.ts";
import { addApplicationRoute } from "@routes/user/application/add-application.ts";
import { getApplicationRoute } from "@routes/user/application/get-application.ts";

const app = new Hono();

app.use(
  "/privileged",
  bearerAuth({
    verifyToken: adminVerifyToken,
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hello!");
});
app.route("/", addUserRoute);
app.route("/", getUserRoute);
app.route("/", addApplicationRoute);
app.route("/", getApplicationRoute);
app.route("/privileged", addAdminRoute);

Deno.serve(app.fetch);
