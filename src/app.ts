import Koa from "koa";
import koaStatic from "koa-static";
import KoaRouter from "koa-router";
import koaBody from "koa-body";
import koaBodyParser from "koa-bodyparser";
import koaCors from "@koa/cors";
import net from "net";
import initContext from "./core/init.context";
import { routerControllers } from "./annotation/router";
import "./completed.dist";
import logger from "./utils/logger";
import * as utils from "./utils";
import { Context } from "./types";
export class App {
   private app: Koa;
   constructor() {
      let app = new Koa();
      this.app = app;
      this.init(app);
   }
   listen(port, host = "0.0.0.0", callback?): net.Server {
      return this.app.listen(port, host, callback);
   }
   private async init(app: Koa) {
      initContext(app);

      //后台请求路径修改
      app.use(async (ctx: Koa.Context, next) => {
         if (/^[\/]{2,}/.test(ctx.url)) {
            return ctx.redirect(ctx.url.replace(/^[\/]{2,}/, "/"));
         }

         if (/^\/(\?.*)?$/.test(ctx.url)) {
            ctx.url = "/index.html";
         }
         if (/\.(css|js|jpg|jpeg|png|gif|ttf|woff|woff2)/i.test(ctx.url)) {
            return next();
         }
         await next();
      });

      app.use(
         koaBody({
            multipart: true,
            formidable: {
               maxFileSize: 50 * 1024 * 1024, // 设置上传文件大小最大限制，默认50M
            },
         }),
      );
      app.use(koaBodyParser({}));

      app.use(async (ctx: Koa.Context, next) => {
         let method = ctx.method;
         let start = Date.now();
         let ip = utils.getClientIp(ctx);
         let host = ctx.hostname;
         try {
            await next().catch((err) => {});
         } catch (err) {
         } finally {
            const ttl = Date.now() - start;
            if (ttl < 100) {
               if (/(options|delete)/i.test(method)) return;
               if (/^\/api\/(m|p)/i.test(ctx.path)) return;
            }
            logger.accept.info(`req ${ctx.method} ${ctx.status} ${host} ${ctx.path} ${ttl}ms ${ip}`);
         }
      });
      app.use(
         koaCors({
            origin: function (ctx) {
               let origin = getOrigin(ctx.header);
               //跨域处理
               //return ctx.header.origin || ctx.host;
               return origin;
            },
            allowHeaders: ["x-requested-with", "Accept", "Content-Type", "token", "deviceid", "appversion"],
            credentials: true,
         }),
      );
      /* this.use(
         compress({
            filter(contentType) {
               return /text|javascript/i.test(contentType);
            },
            threshold: 10240,
            gzip: {
               flush: require("zlib").constants.Z_SYNC_FLUSH,
            },
            deflate: {
               flush: require("zlib").constants.Z_SYNC_FLUSH,
            },
            br: false, // disable brotli
         }),
      ); */

      app.use(async (ctx: Koa.Context, next) => {
         let acceptDomain = ctx.hostname;
         if (/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/i.test(acceptDomain) && acceptDomain != "127.0.0.1") {
            ctx.status = 404;
            ctx.message = "not found";
            ctx.body = "404 not found";
            return;
         }

         return next();
      });

      const routerRoot = new KoaRouter();
      routerRoot.use(routerControllers.routes(), routerControllers.allowedMethods()); //路油
      app.use(routerRoot.routes()).use(routerRoot.allowedMethods()); //路油

      //mkdirs(config.staticWWW);
      //app.use(koaStatic(config.staticWWW));
      //app.use(koaStatic(config.staticRootPath));

      /*   let req = new http.IncomingMessage(new Socket());
      let res = new http.ServerResponse(req);
      let ctx: Context = <Context>app.createContext(req, res); */
   }
}
export function getOrigin(header, host?) {
   if (header.origin) return header.origin; //.replace(/^https?:\/\//, '');
   let refer = header.referer || host || "";
   if (!refer) return "";
   let up = new URL(refer);
   refer = up.protocol + "//" + up.host;
   return refer;
}
export default App;
module.exports = App;
