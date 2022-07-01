import { appendFileSync, existsSync, writeFileSync } from 'fs';

export enum Level {
  OFF = 0,
  ERROR = 1,
  WARN = 2,
  LOG = 3,
  INFO = 4,
  DEBUG = 5,
  TRACE = 6
}

export class Logger {
  filePath: string;
  useConsole: boolean = true;
  level: Level;
  constructor(level: Level = Level.DEBUG, filePath: string = 'candlepin.log', useConsole: boolean = true) {
    this.filePath = filePath;
    this.level = level;
    this.useConsole = useConsole;
  }

  #log(level: Level, message: string) {
    if (level <= this.level && this.level !== Level.OFF) {
      const logMessage = `${new Date().toISOString()} ${[Level[level].toUpperCase()]} ${message}`;
      if (this.useConsole) {
        (console as any)[['error', 'warn', 'log', 'info', 'debug', 'trace'][level]](logMessage)
      }

      (existsSync(this.filePath) ? appendFileSync : writeFileSync)(this.filePath, logMessage);
    }
  }

  error(error: string | Error) {
    this.#log(Level.ERROR, error instanceof Error ? error.stack as string : error);
  }
  
  warn(message: string) {
    this.#log(Level.WARN, message);
  }
  
  log(message: string) {
    this.#log(Level.LOG, message);
  }
  
  info(message: string) {
    this.#log(Level.INFO, message);
  }
  
  debug(message: string) {
    this.#log(Level.DEBUG, message);
  }
  
  trace(message: string) {
    this.#log(Level.TRACE, message);
  }
}