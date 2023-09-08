import { Context, Service as IService } from "../types";

export abstract class Service implements IService {
   public ctx: Context;
}
export default Service;
