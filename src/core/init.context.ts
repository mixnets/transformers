import logger from "../utils/logger";
import Model from "../model";
import Service from "../service";
import Koa from "koa";

export default async function initContext(app: Koa) {
   app.context.model = new Model();
   app.context.logger = logger;
   app.context.language = function () {
      let lang = this.cookies.get("lang") || this.get("accept-language") || "en";
      return lang;
   };
   app.context.domain = function () {
      let domain = this.hostname.replace(/(^www\.)|(:\d+$)/, "");
      return domain;
   };

   let service = new Service();
   //const proxyMap = {};
   Object.defineProperty(app.context, "service", {
      get: function () {
         const _ctx = this;
         if (_ctx.__service) return _ctx.__service;
         _ctx.__serviceMap = _ctx.__serviceMap || {};
         let proxy = new Proxy(service, {
            get: function (target, field) {
               if (_ctx.__serviceMap[field]) return _ctx.__serviceMap[field];
               if (field in target) {
                  let svc = new target[field].constructor(_ctx);
                  svc.ctx = _ctx;
                  _ctx.__serviceMap[field] = svc;
                  return svc;
               }
               console.warn("no service", field);
               return undefined;
            },
         });
         _ctx.__service = proxy;
         return proxy;
      },
   });
   ///////////init service end///////////////////

   app.context.error = function (msg, code = 500) {
      //this.headers["context-type"] = "application/json; utf8";
      this.set("context-type", "application/json; utf8");
      this.body = {
         code: code,
         msg: msg,
      };
   };
   app.context.success = function (data?: { [key: string]: any }) {
      //this.headers["context-type"] = "application/json; utf8";
      this.set("context-type", "application/json; utf8");
      this.body = {
         code: 200,
         data: data,
      };
   };
}
