import { JSONFilePreset } from "npm:lowdb/node";

interface App {
  id: string;
}

interface User {
  email: string;
  apps: App[];
}

interface Database {
  allowedEmails: string[];
  currentUsers: User[];
}

const USER = await JSONFilePreset<Database>("user-db.json", {
  allowedEmails: [],
  currentUsers: [],
});
await USER.write();

export { USER };
