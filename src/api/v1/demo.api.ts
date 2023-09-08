import { tagsAll, summary, query, body } from "koa-swagger-decorator";
import BaseApi, { router, Context } from "../../core/api";
import { Demo } from "../../model";
import dayjs from "dayjs";

@tagsAll(["前端/节点管理"])
export default class AppDemoApi extends BaseApi {
   @router("get", "/api/v1/demo/create")
   @summary("demo create")
   async createDemo(ctx: Context) {
      console.info("create demo=====");
      let data = await ctx.model.demo.insert(
         new Demo({
            label: "demo-" + dayjs().format("YYYY-MM-DD HH:mm:ss"),
            img: "https://www.qq.com/logo.png",
         }),
      );
      ctx.success(data);
   }
   @router("get", "/api/v1/demo/:id")
   @summary("demo")
   async getDemo(ctx: Context) {
      console.info("get demo=====");
      let id = ctx.params.id;
      let data = await ctx.model.demo.get(id);
      ctx.success(data);
   }

   @router("get", "/api/v1/demos")
   @summary("demo create")
   async getList(ctx: Context) {
      console.info("list demo=====");
      let list = await ctx.model.demo.find({});
      ctx.success({ list });
   }
}
