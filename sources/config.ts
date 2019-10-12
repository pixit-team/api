import envOrThrow from "./utils/envOrThrow";

const DEFAULT_PORT = "5000";

export interface Config {
  PORT: number;
  DB_URL: string;
  JWT_PRIVATE_KEY: string;
}

export default function loadConfig(): Config {
  const config = {} as Config;

  config.PORT = parseInt(envOrThrow("PORT", DEFAULT_PORT), 10);
  if (Number.isNaN(config.PORT)) {
    throw new Error("Invalid PORT");
  }
  config.DB_URL = envOrThrow("DATABASE_URL");
  config.JWT_PRIVATE_KEY = envOrThrow("JWT_PRIVATE_KEY");

  return config;
}
