import { createLogger } from "../config/logger";

export const logger = {
  app: createLogger("app.log"),
  error: createLogger("error.log"),
  server: createLogger("server.log"),
  job: createLogger("job.log"),
};
