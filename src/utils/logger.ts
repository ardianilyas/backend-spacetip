import { createLogger } from "../config/logger";

export const logger = {
  app: createLogger("app.log"),
  job: createLogger("job.log"),
};
