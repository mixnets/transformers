import { tagsAll, summary, query, body } from "koa-swagger-decorator";
import { BaseApi, router, Context } from "../../core/api";
import { Demo } from "~/src/model";
import dayjs from "dayjs";

@tagsAll(["前端/节点管理"])
export default class AppMedisApi extends BaseApi {
   @router("get", "/api/v1/ip")
   @summary("ip")
   async get(ctx: Context) {
      let ip = this.getClientIp();
      let contentType = ctx.get("content-type");
      ctx.response.set("api-version", env.apiVersion);
      if (/json/i.test(contentType)) {
         ctx.body = JSON.stringify({
            ip: ip,
         });
      } else {
         ctx.body = ip;
      }
   }
}
