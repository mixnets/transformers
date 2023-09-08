import { Column, IsNotEmpty, Model, Schema } from "@ai-lion/liondb";

export class Demo extends Schema {
   constructor(data) {
      super();
      data && this.reduce(data);
   }

   @Column({
      type: "string",
   })
   @IsNotEmpty()
   label: string;

   @Column({
      type: "string",
   })
   @IsNotEmpty()
   img: string;
}

export class DemoModel extends Model<Demo> {
   constructor() {
      super({
         table: "demo",
         indexs: [{ name: "label", fields: ["label"] }],
         SchemaClass: Demo,
      });
      this.init();
   }

   private async init() {}

   async list(): Promise<Demo[]> {
      let list = await this.find({
         start: 0,
         limit: 12,
         reverse: true,
      });
      return list.map((v) => v);
   }
}
