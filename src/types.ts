import Koa from "koa";
import ServiceInstance from "./service";
import ModelInstance from "./model";

export interface Context extends Koa.Context {
   success(data?: { [key: string]: any }): void;
   error(msg: string, code?: number): void;
   request: Request;
   service: ServiceInstance;
   model: ModelInstance;
   query: { [key: string]: any };
   params: { [key: string]: any };
}
interface Request extends Koa.Request {
   body: any;
   /** 依赖 koa-body 插件 */
   files: any;
}
export interface Service {
   ctx: Context;
}
