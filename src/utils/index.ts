import Koa from "koa";
import fs from "fs";
import EnvDefault from "@/env";

export function getClientIp(ctx: Koa.Context): string {
   let ip =
      ctx.get("cf-connecting-ip") || //
      ctx.get("x-client-ip") ||
      ctx.get("x-forwarded-for") ||
      ctx.get("x-real-ip") ||
      "";
   if (!ip) {
      try {
         ip = ctx.socket.remoteAddress || "";
      } catch (err) {}
   }
   ip = ip?.replace(/^::ffff:/, "").trim();
   ip = (ip.split(",")[0] || "").trim();
   return ip || "";
}

export function loadEnv(file: string): Env {
   let env = {} as Env;
   try {
      let envString = fs.readFileSync(file).toString("utf8");
      let lines = envString.split(/[\r\n]/).filter((v) => !!v);
      for (let line of lines) {
         let kv = line.split("=").map((v) => v.trim());
         let value = (kv[1] || "").trim();
         let key = kv[0]
            .split("_")
            .map((v, i) => {
               if (i < 1) return v;
               return v.substring(0, 1).toUpperCase() + v.substring(1);
            })
            .join("");
         const defaultType = typeof EnvDefault[key];
         env[key] = /^\d+(\.\d+)?$/i.test(value) ? Number(value) : value;
         switch (defaultType) {
            case "number":
               env[key] = Number(value);
               break;
            case "boolean":
               env[key] = ["yes", "true", "ok", "enable"].includes(value);
               break;
            default:
               env[key] = value;
         }
      }
   } catch (err) {}
   env = Object.assign({}, EnvDefault, env);
   return env;
}
