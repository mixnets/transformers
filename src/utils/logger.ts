/* import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone); */
//const timezonel = "Asia/Shanghai";

import winston from "winston";
import "winston-daily-rotate-file";
import os from "os";
import path from "path";
import mkdirs from "mkdirs";
import pkg from "../../package.json";
import querystring from "querystring";
import dayjs from "dayjs";

const logDir = global.env.DEV ? path.resolve("logs") : path.join(os.homedir(), pkg.name.replace(/^.*[\/]/, ""), "logs");
mkdirs(logDir);
console.info("logdir", logDir);

const logFormat = winston.format.combine(
   winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
   //winston.format.align(),
   winston.format.printf((info) => `${dayjs().format("YYYY-MM-DD HH:mm:ss")} ${info.level} ${info.message}`),
   //winston.format.json(),
);

function buildWinLogger(serverName: string): Logger0 {
   const log = winston.createLogger({
      level: global.env.logger,
      format: logFormat,
      defaultMeta: { service: serverName },
      transports: [
         new winston.transports.Console(),
         new winston.transports.DailyRotateFile({
            filename: path.join(logDir, `${serverName}-%DATE%.log`),
            level: "info",
            zippedArchive: true,
            maxSize: global.env.loggerSize,
            maxFiles: global.env.loggerDay,
         }),
         new winston.transports.DailyRotateFile({
            filename: path.join(logDir, `log-%DATE%.log`),
            level: "info",
            zippedArchive: true,
            maxSize: global.env.loggerSize,
            maxFiles: global.env.loggerDay,
         }),
         new winston.transports.DailyRotateFile({
            filename: path.join(logDir, `error-%DATE%.log`),
            level: "error",
            zippedArchive: true,
            maxSize: global.env.loggerSize,
            maxFiles: global.env.loggerDay,
         }),
      ],
   });
   return new Logger0(log);
}

function toString(args: any[]) {
   let r = args
      .map((v) => {
         if (typeof v == "object") return querystring.stringify(v);
         else return (v || "").toString().trim();
      })
      .join(" ");
   return r;
}
class Logger0 implements Logger {
   logger: any; //winston.Logger;
   constructor(logger) {
      this.logger = logger;
   }
   info(...args) {
      //this.logger.info.bind(this.logger)(...args);
      this.logger.info(toString(args));
   }
   warn(...args) {
      //this.logger.warn.bind(this.logger)(...args);
      this.logger.warn(toString(args));
   }
   error(...args) {
      //this.logger.error.bind(this.logger)(...args);
      this.logger.error(toString(args));
   }
   debug(...args) {
      //this.logger.debug.bind(this.logger)(...args);
      this.logger.debug(toString(args));
   }
   log(...args) {
      //this.logger.debug.bind(this.logger)(...args);
      this.debug(...args);
   }
}
const log = buildWinLogger("log");
const user = buildWinLogger("user");
const accept = buildWinLogger("accept");

/* const user = console;
const accept = console;
const log = console; */
export class LoggerX implements Logger {
   user = user;
   accept = accept;
   info(...args) {
      log.info(...args);
   }
   log(...args) {
      log.log(...args);
   }
   warn(...args) {
      log.warn(...args);
   }
   error(...args) {
      log.error(...args);
   }
   debug(...args) {
      log.debug(...args);
   }
}

const expLog = new LoggerX();

export default expLog;
