import { getClientIp } from "../utils";
import { Context } from "../types";
import router from "../annotation/router";
import logger from "../utils/logger";

export { router, Context, logger };

export class BaseApi {
   public ctx: Context;
   logger: Logger = logger;
   getClientIp(): string {
      return getClientIp(this.ctx);
   }

   getUseAgent(): string {
      return this.ctx.get("user-agent");
   }
}
export default BaseApi;
