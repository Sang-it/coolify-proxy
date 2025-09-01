import process from "node:process";

export const getEnvThrows = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Key: ${key} is not set.`);
  }
  return value;
};
