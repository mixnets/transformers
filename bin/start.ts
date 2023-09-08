import * as utils from "@/utils";
import { Model } from "@ai-lion/liondb";
import pkg from "../package.json";
Model.setApp(pkg.name.replace(/^@+/, ""));
import path from "path";
const env = utils.loadEnv(path.resolve(".env"));

globalThis.env = env;
globalThis.wait = (ttl: number = 1) => {
   return new Promise((resolve) => {
      setTimeout(() => resolve(), ttl);
   });
};
import logger from "@/utils/logger";
globalThis.logger = logger;
/* import { Model } from "@ai-lion/liondb";
Model.setApp(env.app); */
const yargs = require("yargs");

process.on("uncaughtException", (e) => console.error("uncaughtException ", e.stack));
process.on("unhandledRejection", (e: any) => logger.warn("unhandledRejection", e.stack));

const optimistUsageLength = 98;

const opts = yargs
   .usage("Usage: $0")
   .wrap(Math.min(optimistUsageLength, yargs.terminalWidth()))
   .options({
      api_version: {
         demandOption: false,
         describe: "使用api版本",
         default: env.apiVersion,
      },
      alive_timeout: {
         demandOption: false,
         describe: "broken connection check timeout (milliseconds)",
         default: 60000,
      },
      sslkey: {
         demandOption: false,
         describe: "path to SSL key",
      },
      sslcert: {
         demandOption: false,
         describe: "path to SSL certificate",
      },
      host: {
         demandOption: false,
         alias: "H",
         describe: "host",
         default: env.host,
      },
      port: {
         demandOption: true,
         alias: "p",
         describe: "port",
         default: env.port,
      },
      path: {
         demandOption: false,
         describe: "custom path",
         default: "/",
      },
   }).argv; //.boolean("allow_discovery")
for (let key of Object.keys(opts)) {
   let field = key
      .split("_")
      .map((v, i) => {
         if (i < 1) return v;
         return v.substring(0, 1).toUpperCase() + v.substring(1);
      })
      .join("");
   if (field in env) {
      if (opts[key]) env[field] = opts[key];
   }
}
(async () => {
   console.info(`=======start====use api_version=${env.apiVersion}`);
   const App = require("../src/app");
   const app = new App();
   let server = app.listen(opts.port, opts.host, () => {
      let address: any = server.address();
      console.info("server listen ", address);
   });
})();
