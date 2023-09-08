import assert from "assert";

describe("测试", async function () {

   it("测试1", () => {
      return new Promise(async (resolve) => {
         let name="lili";
         assert.ok(name=="lili", "name is not lini");
         resolve(undefined);
      });
   })
});

async function wait(ttl) {
   return new Promise((resolve) => {
      setTimeout(() => resolve(undefined), ttl);
   });
}