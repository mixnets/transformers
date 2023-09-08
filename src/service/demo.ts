import { Service } from "../core/service";

export class DemoService extends Service {
   get(id: string) {
      return this.ctx.model.demo.get(id);
   }
}

export default DemoService;
