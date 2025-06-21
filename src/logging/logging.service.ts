import { Injectable } from '@nestjs/common';
import { createWriteStream, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  data?: any;
}

@Injectable()
export class LoggingService {
  private readonly logLevel: LogLevel;
  private readonly logToFile: boolean;
  private readonly logDirectory: string;
  private readonly maxFileSize: number; // in bytes
  private currentLogFile: string;
  private fileStream?: NodeJS.WritableStream;

  constructor() {
    this.logLevel = this.getLogLevelFromEnv();
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logDirectory = process.env.LOG_DIRECTORY || './logs';
    this.maxFileSize =
      parseInt(process.env.LOG_MAX_FILE_SIZE_KB || '1024') * 1024; // Convert KB to bytes

    if (this.logToFile) {
      this.ensureLogDirectory();
      this.initializeLogFile();
    }
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    switch (level) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.logDirectory)) {
      mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  private initializeLogFile(overwrite: boolean = false): void {
    this.currentLogFile = join(this.logDirectory, 'app.log');
    const flags = overwrite ? 'w' : 'a';
    this.fileStream = createWriteStream(this.currentLogFile, { flags });
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, data } = entry;
    let logLine = `[${timestamp}] [${level}]`;

    if (context) {
      logLine += ` [${context}]`;
    }

    logLine += ` ${message}`;

    if (data) {
      logLine += ` ${JSON.stringify(data)}`;
    }

    return logLine + '\n';
  }

  private writeLog(entry: LogEntry): void {
    const formattedLog = this.formatLogEntry(entry);

    process.stdout.write(formattedLog);

    if (this.logToFile && this.fileStream) {
      this.checkFileRotation();
      this.fileStream.write(formattedLog);
    }
  }

  private checkFileRotation(): void {
    if (!this.currentLogFile || !existsSync(this.currentLogFile)) {
      return;
    }

    const stats = statSync(this.currentLogFile);
    if (stats.size >= this.maxFileSize) {
      this.rotateLogFile();
    }
  }

  private rotateLogFile(): void {
    if (this.fileStream) {
      this.fileStream.end();
    }

    this.initializeLogFile(true);
  }

  private createLogEntry(
    level: string,
    message: string,
    context?: string,
    data?: any,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };
  }

  error(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry('ERROR', message, context, data);
      this.writeLog(entry);
    }
  }

  warn(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry('WARN', message, context, data);
      this.writeLog(entry);
    }
  }

  info(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry('INFO', message, context, data);
      this.writeLog(entry);
    }
  }

  debug(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry('DEBUG', message, context, data);
      this.writeLog(entry);
    }
  }

  logRequest(req: any, res: any): void {
    const requestData = {
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
      headers: req.headers,
      ip: req.ip,
    };

    const responseData = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    };

    this.info(`${req.method} ${req.url} - ${res.statusCode}`, 'HTTP', {
      request: requestData,
      response: responseData,
    });
  }

  logError(error: Error, context?: string): void {
    this.error(error.message, context || 'Exception', {
      stack: error.stack,
      name: error.name,
    });
  }

  onModuleDestroy(): void {
    if (this.fileStream) {
      this.fileStream.end();
    }
  }
}
