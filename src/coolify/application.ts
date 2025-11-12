import { getLocalhostServer } from "./server.ts";
import { COOLIFY_ACCESS_TOKEN, ENDPOINT } from "./constant.ts";

interface IAddApplication {
  domains: string;
  git_repository: string;
  project_uuid: string;
  git_branch: string;
  ports_exposes: string;
  build_pack:
    | "nixpacks"
    | "static"
    | "dockerfile"
    | "dockercompose";
  install_command?: "string";
  build_command?: "string";
  start_command?: "string";
}

interface IUpdateApplication {
  domains: string;
  git_repository: string;
  project: string;
  git_branch: string;
  ports_exposes: string;
  build_pack:
    | "nixpacks"
    | "static"
    | "dockerfile"
    | "dockercompose";
  install_command?: "string";
  build_command?: "string";
  start_command?: "string";
}

const HARDWARE_LIMITS = {
  limits_memory: "2g",
  limits_memory_reservation: "1g",
  limits_cpus: "1",
  limits_memory_swap: "2g",
  limits_cpuset: "",
  limits_cpu_shares: 256,
};

export const createApplication = async (params: IAddApplication) => {
  const server_uuid = await getLocalhostServer();

  const body = {
    environment_name: "production",
    server_uuid,
    ...params,
    ...HARDWARE_LIMITS,
  };

  const response = await fetch(ENDPOINT.APPLICATION_PUBLIC, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
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
  return response.json();
};

export const updateApplication = async (params: IUpdateApplication) => {
  const body = {
    ...params,
  };

  const response = await fetch(ENDPOINT.APPLICATION_PUBLIC, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't update application. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const listApplication = async () => {
  const response = await fetch(`${ENDPOINT.APPLICATION}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't list application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const getApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
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

export const startApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/start`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't start application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const stopApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/stop`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't stop application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const restartApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/restart`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't restart application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const deleteApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
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

export const listEnv = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/envs`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't get environment variables. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

interface IEnv {
  key: string;
  value: string;
}

export const createEnv = async (uuid: string, params: IEnv) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/envs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params, is_preview: true }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't create environment variable. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const updateEnv = async (uuid: string, params: IEnv) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/envs`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params, is_preview: true }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't update environment variable. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const deleteEnv = async (app_uuid: string, env_uuid: string) => {
  const response = await fetch(
    `${ENDPOINT.APPLICATION}/${app_uuid}/envs/${env_uuid}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't delete environment variable. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};
