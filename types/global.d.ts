declare var env: Env;
declare var wait: (ttl: number) => Promise<void>;

declare var logger: Logger;

type ApiPage = {
   pageNo: number;
   pageSize: number;
};

type QueryPage = {
   start: number;
   limit?: number;
};
declare enum Status {
   /** 正常 */
   Normal = 1,
   /** 删除 */
   Delete = 0,
   /** 禁用 */
   Disable = 10
}
