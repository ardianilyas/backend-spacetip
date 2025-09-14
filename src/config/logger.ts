import fs from "fs";
import path from "path";
import pino, { multistream, Logger } from "pino";
import pretty from "pino-pretty";

// Pastikan folder logs ada
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export function createLogger(fileName: string): Logger {
  const logFile = fs.createWriteStream(path.join(logDir, fileName), { flags: "a" });

  const consoleStream =
    process.env.NODE_ENV === "development"
      ? pretty({
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        })
      : process.stdout;

  const streams = [
    { stream: consoleStream }, // tampil di console
    { stream: logFile },       // simpan ke file
  ];

  return pino(
    {
      level: process.env.LOG_LEVEL || "info",
      base: undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
      },
    },
    multistream(streams)
  );
}