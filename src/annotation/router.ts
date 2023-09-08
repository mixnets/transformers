/** @format */

import { Context } from "koa";
import path from "path";
import Router from "koa-router";
import { request as srequest, summary, body as sbody, responsesAll, tagsAll, SwaggerRouter } from "koa-swagger-decorator";
import logger from "../utils/logger";
import Stream from "stream";

/* export const routerControllers: Router = new SwaggerRouter();
export const routerApis = new Router(); */
const useSwaggerRouter = env.DEV;

export const routerControllers: any = useSwaggerRouter ? new SwaggerRouter() : new Router();

//const controllers = {};
export type RouterOptions = {
   version?: string;
};
//request: (method: string, path: string) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * 路油器
 * @param method 方法
 * @param path 路油路径
 * @param format 输出格式化
 */
export default function router(method: string, path: string, options?: RouterOptions) {
   options = Object.assign({ version: env.apiVersion }, options);
   return function (target: any, name: string, descriptor: PropertyDescriptor) {
      if (routerControllers[method.toLowerCase()]) {
         let shortPath = path.replace(new RegExp(`\/${env.apiVersion}\/`, ""), "/");
         routerControllers[method.toLowerCase()](path, routerInstance);
         logger.debug(`==router ${method} ${path}`);

         if (path != shortPath) {
            routerControllers[method.toLowerCase()](shortPath, routerInstance);
            logger.info(`==router ${method} ${shortPath} -> ${path}`);
         }

         async function routerInstance(ctx: Context, next: Function) {
            ctx.status = 200;
            try {
               let instance = new target.constructor();
               instance.ctx = ctx;

               //let instance =  new target.constructor();
               //let res = await target[name].apply(instance, args);
               let res = await descriptor.value.apply(instance, [ctx, next]).catch((err) => {
                  logger.error("exec api error ", method, path, err.message, err);
                  return {
                     code: 500,
                     msg: err.message,
                  };
               });
               ctx.response.set("api-version", env.apiVersion);
               if (Buffer.isBuffer(res) || res instanceof Stream) {
                  ctx.type = ctx.type || "application/octet-stream";
                  ctx.body = res;
                  return;
               }

               if (res != null && res != undefined) {
                  ctx.type = ctx.type || "application/json; charset=utf-8";
                  /*        if (res instanceof Result && res.code != 200) {
                     //警告日志
                     logger.info("req warn ", `[${method}][${path}]`, res.msg, clientIp);
                  } */
                  res = formatOutput(res);
                  ctx.body = res;
               } else if (ctx.body === undefined) {
                  ctx.status = 200;
                  ctx.body = {
                     code: 501,
                     msg: "no response",
                  };
               }
            } catch (err) {
               logger.error("router handle error " + err.message, err);
               ctx.status = 200;
               ctx.body = {
                  code: 500,
                  msg: err.message,
               };
            }
         }
      }
      if (useSwaggerRouter) {
         //api文档生成
         //let methodAnt = descriptor.value;
         let swaggerPath = path.replace(/\/:[0-9a-z]+/gi, (v) => {
            return "/{" + v.substring(2) + "}";
         });
         srequest(method, swaggerPath)(target, name, descriptor);
      }
      return descriptor;
   };
}

/**
 * 格式化输出
 * @param result
 * @param outpurFormat
 */
function formatOutput(result: any, outpurFormat?) {
   let data;
   if (result === null || result === undefined)
      return {
         code: 501,
         msg: "no response",
      };
   if (result.code && (result.msg || result.data)) {
      return result;
   } else if (["string", "number", "boolean"].includes(typeof result)) {
      return result;
   } else {
      data = result;
      result = {
         code: 200,
         data: data,
      };
   }
   let toData;
   if (outpurFormat instanceof Function) {
      if (data instanceof Array) {
         toData = data.map((v) => outpurFormat(v));
      } /* else if (data instanceof Page) {
         toData = data.transfor(outpurFormat);
      } */ else {
         toData = data;
      }
   } else {
      if (data instanceof Array) {
         toData = data.map((v) => _subMerge(v, outpurFormat));
      } /* else if (data instanceof Page) {
         toData = data.transfor(outpurFormat);
      }  */ else if (typeof data === "object") {
         toData = _subMerge(data, outpurFormat);
      } else {
         toData = data;
      }
   }
   result.data = toData;
   return result;
}
/**
 * 转换
 *
 */
function _subMerge(source: any, target: any) {
   let res = {},
      count = 0;
   if (source === null || source === undefined) {
      return undefined;
   }
   for (let key in target) {
      let handle = target[key];
      if (handle) {
         if (handle instanceof Function) {
            res[key] = source[key];
            res[key + "Desc"] = handle(source[key]);
         } else {
            res[handle] = source[key];
         }
         count++;
      }
   }
   return count > 0 ? res : source;
}
if (env.DEV && useSwaggerRouter && routerControllers instanceof SwaggerRouter) {
   const apiJsonPath = "/api/swagger-json";
   routerControllers.get("/api/swagger-json", async (ctx: any, next) => {
      await next();
      let paths: any = [],
         pathMap = ctx.body.paths;
      for (let key in pathMap) {
         paths.push({
            key,
            value: pathMap[key],
         });
      }
      paths = paths.sort((a, b) => {
         for (let i = 0; i < a.key.length && i < b.key.length; i++) {
            let v1 = a.key[i].charCodeAt(0),
               v2 = b.key[i].charCodeAt(0);
            if (v1 < v2) return -1;

            if (v1 > v2) return 1;
         }
      });
      let nmap = {};
      paths.forEach((v) => {
         nmap[v.key] = v.value;
      });
      ctx.body.paths = nmap;
   });
   // Swagger endpoint
   routerControllers["swagger"]({
      title: "light-network api",
      description: "API REST",
      version: "1.0.0",
      prefix: "/",
      // [optional] default is /swagger-html
      swaggerHtmlEndpoint: "/api/swagger-html",
      // [optional] default is /swagger-json
      swaggerJsonEndpoint: apiJsonPath,
      swaggerOptions: {
         securityDefinitions: {
            api_key: {
               type: "apiKey",
               in: "header",
               name: "api_key",
            },
            token: {
               in: "header",
               name: "token",
            },
         },
      },
      // [optional] additional configuration for config how to show swagger view
      swaggerConfiguration: {
         display: {
            defaultModelsExpandDepth: 4, // The default expansion depth for models (set to -1 completely hide the models).
            defaultModelExpandDepth: 3, // The default expansion depth for the model on the model-example section.
            docExpansion: "none", // Controls the default expansion setting for the operations and tags.
            defaultModelRendering: "model", // Controls how the model is shown when the API is first rendered.
         },
      },
   });
   routerControllers["mapDir"](path.resolve(__dirname, "../api"), {
      // default: true, if true, you can call ctx.validatedBody[Query|Params] to get validated data.
      doValidation: false,
   });
} else {
   let scan = new SwaggerRouter();
   scan["mapDir"](path.resolve(__dirname, "../api"), {
      // default: true, if true, you can call ctx.validatedBody[Query|Params] to get validated data.
      doValidation: true,
   });
}
