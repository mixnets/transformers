import pkg from "../package.json";
import path from "path";
const isDev = process.env.NODE_ENV == "development";
const envx: Env = {
   app: pkg.name,
   mode: isDev ? "dev" : "prod",
   PROD: !isDev,
   DEV: isDev,
   port: 80,
   host: "0.0.0.0",
   apiVersion: "v1",
   apiToken: "apitoken",
   logger: "info",
   loggerDay: "7d",
   loggerSize: "10m",
   staticWWW: isDev ? "./tmp/www" : path.resolve("./www"),
   pageSize: 24,
};
console.info("www==", isDev, envx.staticWWW);
export default envx;
