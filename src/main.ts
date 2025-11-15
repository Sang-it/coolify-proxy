import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  createApplicationRoute,
  createEnvRoute,
  deleteApplicationRoute,
  deleteEnvRoute,
  listEnvRoute,
  restartApplicationRoute,
  startApplicationRoute,
  stopApplicationRoute,
  updateApplicationRoute,
  updateEnvRoute,
} from "@routes/application/index.ts";
import {
  createDatabaseRoute,
  deleteDatabaseRoute,
  restartDatabaseRoute,
  startDatabaseRoute,
  stopDatabaseRoute,
} from "@routes/database/index.ts";
import {
  createProjectRoute,
  deleteProjectRoute,
  getProjectResourcesRoute,
  listProjectRoute,
} from "@routes/project/index.ts";
import {
  createUserRoute,
  deleteUserRoute,
  listUserRoute,
  signinUserRoute,
} from "@routes/user/index.ts";
import { _truncateDbRoute } from "@routes/_truncate-db.ts";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hello!");
});

app.route("/", createApplicationRoute);
app.route("/", updateApplicationRoute);
app.route("/", deleteApplicationRoute);

app.route("/", restartApplicationRoute);
app.route("/", startApplicationRoute);
app.route("/", stopApplicationRoute);

app.route("/", listEnvRoute);
app.route("/", createEnvRoute);
app.route("/", updateEnvRoute);
app.route("/", deleteEnvRoute);

app.route("/", createProjectRoute);
app.route("/", getProjectResourcesRoute);
app.route("/", listProjectRoute);
app.route("/", deleteProjectRoute);

app.route("/", createDatabaseRoute);
app.route("/", deleteDatabaseRoute);

app.route("/", restartDatabaseRoute);
app.route("/", startDatabaseRoute);
app.route("/", stopDatabaseRoute);

app.route("/", createUserRoute);
app.route("/", listUserRoute);
app.route("/", deleteUserRoute);
app.route("/", signinUserRoute);

app.route("/", _truncateDbRoute);

Deno.serve(app.fetch);
