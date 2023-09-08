/**
 * 打包build的时候使用, 正常项目请不要使用这里的代码
 * 请慎重往进而添加内容, 只添加与打包相关的代码
 * 这里兼容typescript-ioc
 *
 * @format
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const config = require("../config");
// const Base = require('../api/base').default;

function createCompleted() {
   //let contentEntity = createEntity();
   console.info("===createCompleted");
   let contentRouterApi = createRouterApi((v) => {
  /*     if (/^V[\d]/i.test(v.name)) {
         return new RegExp("^" + config.apiVersion, "i").test(v.name);
      } */
      return true;
   });
   //let conterSub = createSubscriber();

   let fpath = path.resolve(__dirname, "../completed.dist.ts");
   //fs.writeFileSync(fpath, [contentEntity, contentRouterApi, conterSub].join("\r\n"));
   fs.writeFileSync(fpath, [contentRouterApi].join("\r\n"));
}
function createSubscriber() {
   let pattern = "src/subscriber/**/*.{ts,js}";
   let list = searchModule(pattern);
   let content = "";
   let prefix = "Sub_";
   content += list
      .map((v) => {
         return `import ${prefix + v.name} from '${v.path}';`;
      })
      .join("\r\n");
   content += "\r\n\r\n";
   // content += `export default [\r\n${list.map(v=>'\t'+v.name).join(',\r\n')}\r\n];\r\n`;
   content += `export const subList = [\r\n${list.map((v) => "\t" + prefix + v.name).join(",\r\n")}\r\n];\r\n`;
   return content;
}
function createEntity() {
   let pattern = "src/entity/**/*.{ts,js}";
   let list = searchModule(pattern);
   let content = "";
   let prefix = "Entity_";
   content += list
      .map((v) => {
         return `import ${prefix + v.name} from '${v.path}';`;
      })
      .join("\r\n");
   content += "\r\n\r\n";
   // content += `export default [\r\n${list.map(v=>'\t'+v.name).join(',\r\n')}\r\n];\r\n`;
   content += `export const entityList = [\r\n${list.map((v) => "\t" + prefix + v.name).join(",\r\n")}\r\n];\r\n`;
   return content;
}
function createRouterApi(filter) {
   let pattern = "src/api/**/*.api.{ts,js}";
   let list = searchModule(pattern);
   list = filter ? list.filter((v, i) => filter(v, i)) : list;
   console.info("createRouterApi", list);
   let content = "";
   let prefix = "Api_";

   /*    list = list.filter((v) => {
      let p = path.resolve("./src/" + v.path.replace(/^[\.\/]+/, ""));
      console.info("it==", v, p, __dirname);
      let mode = require(p);
      let de = mode.default;
      if (!de) return false;
      return true;
   }); */
   content += list
      .map((v) => {
         return `import ${prefix + v.name} from '${v.path}';`;
      })
      .join("\r\n");
   content += "\r\n\r\n";
   // content += `export default [\r\n${list.map(v=>'\t'+v.name).join(',\r\n')}\r\n];\r\n`;
   content += `export const apiList = [\r\n${list.map((v) => "\t" + prefix + v.name).join(",\r\n")}\r\n];\r\n`;
   return content;
}
function searchModule(pattern) {
   let modes = [];
   let prefix = pattern.replace(/\*.*$/, "");
   let list = glob.sync(pattern) || [];
   list.forEach((v) => {
      let model = v
         .replace(prefix, "")
         .replace(/\.[^.]*$/, "")
         .replace(/([./])[a-zA-Z0-9]/g, (v) => v[1].toUpperCase());
      model = upperFirst(model);
      let modelPath = v.replace(/^\.?\/?src\//, "./");
      modes.push({
         name: model,
         path: modelPath.replace(/\.(ts|js)$/, ""),
      });
   });
   return modes;
}
function upperFirst(str) {
   return str.substring(0, 1).toUpperCase() + str.substring(1);
}
/* module.exports = {
   searchModule,
   createCompleted,
}; */
createCompleted();
