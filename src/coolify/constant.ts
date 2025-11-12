import { getEnvThrows } from "@utils/throws-env.ts";

const COOLIFY_BASE_URL = getEnvThrows("COOLIFY_BASE_URL");
export const COOLIFY_ACCESS_TOKEN = getEnvThrows("COOLIFY_ACCESS_TOKEN");

export const ENDPOINT = {
  COOLIFY_BASE_URL,
  SERVER: COOLIFY_BASE_URL + "/api/v1/servers",
  PROJECT: COOLIFY_BASE_URL + "/api/v1/projects",
  APPLICATION: COOLIFY_BASE_URL + "/api/v1/applications",
  APPLICATION_PUBLIC: COOLIFY_BASE_URL + "/api/v1/applications/public",
  DEPLOY: COOLIFY_BASE_URL + "/api/v1/deploy",
  DATABASE: COOLIFY_BASE_URL + "/api/v1/databases",
};
