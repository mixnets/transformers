type Env = {
   /** 应用名 */
   app: string;
   /** 运行环境 */
   mode: "dev" | "prod";
   /** 生成环境 */
   PROD: boolean;
   /** 开发环境 */
   DEV: boolean;
   /** http端口 默认80 */
   port: number;
   /** 绑定主机ip地址,默认0.0.0.0 */
   host: string;
   /** 使用api版本 */
   apiVersion: string;
   /** api token */
   apiToken: string;
   /** 日志级别 */
   logger: "debug" | "info" | "error" | "warning";
   /** 日志分隔天数 */
   loggerDay: "1d" | "7d" | "14d" | "30d";
   /** logger 单日志最大大小,如: 10m 表示10M */
   loggerSize: string;
   /** 静态文件目录 */
   staticWWW: string;
   /** 分页大小 */
   pageSize: number;
};
