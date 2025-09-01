import { getEnvThrows } from "@utils/throws-env.ts";

const COOLIFY_API_KEY = getEnvThrows("COOLIFY_API_KEY");
const COOLIFY_API_URL = getEnvThrows("COOLIFY_API_URL");

// https://coolify.io/docs/api-reference/authorizationconst
const SERVER = COOLIFY_API_URL + "/api/v1/servers";
const PROJECT = COOLIFY_API_URL + "/api/v1/projects";
const APPLICATION = COOLIFY_API_URL + "/api/v1/applications";
const APPLICATION_PUBLIC = APPLICATION + "/public";
const DEPLOY = COOLIFY_API_URL + "/api/v1/deploy";

interface PartialServer {
  name: string;
  uuid: string;
}

const getLocalhostServer = async () => {
  const response = await fetch(SERVER, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_API_KEY}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve server info. \n ${JSON.stringify(data)}`,
    );
  }
  const servers: PartialServer[] = await response.json();

  if (servers.length == 0) {
    throw new Error(
      "No server exists.",
    );
  }
  return servers.filter((server) => {
    return server.name == "localhost";
  })[0];
};

interface PartialProject {
  name: string;
  uuid: string;
}

const getProject = async () => {
  const response = await fetch(PROJECT, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_API_KEY}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve project info. \n ${JSON.stringify(data)}`,
    );
  }
  const projects: PartialProject[] = await response.json();
  if (projects.length == 0) {
    throw new Error(
      "No project exists.",
    );
  }
  return projects.filter((project) => {
    return project.name == "CS-230"; //TODO: refactor
  })[0];
};

interface IAddApplication {
  domains: string;
  gitRepository: string;
}

interface PartialApplication {
  uuid: string;
}

export const addApplication = async (params: IAddApplication) => {
  const server = await getLocalhostServer();
  const project = await getProject();
  const body = {
    environment_name: "production",
    git_branch: "main",
    build_pack: "static",
    ports_exposes: "80",
    domains: params.domains,
    server_uuid: server.uuid,
    project_uuid: project.uuid,
    git_repository: params.gitRepository,
  };

  const response = await fetch(APPLICATION_PUBLIC, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't create application. \n ${JSON.stringify(data)}`,
    );
  }

  const data: PartialApplication = await response.json();
  return data;
};

export const getApplication = async (uuid: string) => {
  const response = await fetch(`${APPLICATION}/${uuid}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't get application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const deployApplication = async (params: PartialApplication) => {
  const response = await fetch(DEPLOY, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't deploy application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const deleteApplication = async (params: PartialApplication) => {
  const response = await fetch(`${APPLICATION}/${params.uuid}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${COOLIFY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't delete application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};
