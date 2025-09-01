import { JSONFilePreset } from "npm:lowdb/node";

interface Database {
  allowedEmails: string[];
}

const ADMIN = await JSONFilePreset<Database>("admin-db.json", {
  allowedEmails: [],
});
await ADMIN.write();
export { ADMIN };
