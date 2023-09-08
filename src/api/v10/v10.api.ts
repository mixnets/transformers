import { tagsAll, summary, query, body } from "koa-swagger-decorator";
import { BaseApi, router, Context } from "../../core/api";

@tagsAll(["前端/节点管理"])
export default class AppMedisApi extends BaseApi {
   @router("get", "/api/v10/ip", {})
   @summary("ip")
   async get(ctx: Context) {
      let ip = this.getClientIp();
      let contentType = ctx.get("content-type");
      if (/json/i.test(contentType)) {
         ctx.body = JSON.stringify({
            ip: ip,
         });
      } else {
         ctx.body = "v10>=" + ip;
      }
   }
}
