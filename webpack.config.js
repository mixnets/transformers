// Generated using webpack-cli https://github.com/webpack/webpack-cli
require("./src/utils/build.dist");

const path = require("path");
//const HtmlWebpackPlugin = require("html-webpack-plugin");
//const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
//const { VueLoaderPlugin } = require("vue-loader");
const isProduction = process.env.NODE_ENV == "production";
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin"); //压缩zip
const pkg = require("./package.json");
const appName = (pkg.name||"").replace(/^[^\/]+\//, "");

//const { createCompleted } = require("./src/utils/build.dist");
//createCompleted();
const config = {
   entry: {
      cli: {
         import: "./bin/start.ts",
         filename: "dist/server.js",
      }
   },
   output: {
      path: path.resolve(__dirname, "dist-ext"),
      clean: {
         keep: /\/ignored\//, // 保留 'ignored/dir' 下的静态资源
      },
      /*       chunkFormat: "commonjs",
      libraryTarget: "commonjs",
      globalObject: 'this',, */
      library: {
         /**
          * https://webpack.docschina.org/configuration/output/#outputlibrarytype
          * 类型默认包括 'var'、'module'、'assign'、'assign-properties'、'this'、'window'、'self'、'global'、
          * 'commonjs'、'commonjs2'、'commonjs-module'、'amd'、'amd-require'、'umd'、'umd2'、'jsonp' 以及 'system'，
          */
         type: "commonjs2",
         umdNamedDefine: true,
      },
   },
   target: "node",
   externals: {
      //扩展不直接加入打包
       //扩展不直接加入打包
       "@ai-lion/liondb": "@ai-lion/liondb",
       "@ai-lion/ipipe": "@ai-lion/ipipe",
       hexoid: "hexoid",
   },
   devServer: {
      open: false,
      host: "localhost",
      port: 9000,
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/i,
            loader: "ts-loader",
            exclude: ["/node_modules/"],
         },
         // Add your rules for custom modules here
         // Learn more about loaders from https://webpack.js.org/loaders/
      ],
   },
   resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
         // 配置目录别名，来确保模块引入变得更简单
         // 在任意目录下require('components/example') 相当于require('项目根目录/src/components/example')
         //components: path.join(root, 'src/components'),
         //views: path.join(root, 'src/views'),
         //styles: path.join(root, 'src/styles'),
         //store: path.join(root, 'src/store')
      },
      fallback: {
         //自定义require的模块 如 require("os") 等
      },
   },
   node: {
      global: true,
      __filename: false,
      __dirname: false,
   },
   plugins: [
      // 目标为 nodejs 环境使用
      /*       new webpack.ProvidePlugin({
         Buffer: ["buffer", "Buffer"],
      }), 
     
      */
      /*       new HtmlWebpackPlugin({
         template: "index.html",
         filename: "index.html", // 打包输出后该html文件的名称
         chunks: ["view"], // 数组元素为chunk名称，即entry属性值为对象的时候指定的名称，index页面只引入 view.js
      }), */
      // 添加VueLoaderPlugin，以响应vue-loader
      //new VueLoaderPlugin(),
      // Add your plugins here
      // Learn more about plugins from https://webpack.js.org/configuration/plugins/
      //new webpack.BannerPlugin({
      //   banner: "/*! https://github.com/ai-lion/liondb */",
      //   raw: true,
      //}),
      new FileManagerPlugin({
         // https://www.npmjs.com/package/filemanager-webpack-plugin
         events: {
            onStart: {
               delete: [
                  "dist-ext/dist"
               ]
            },
            onEnd: {
            /*    delete: [
                  //"dist-ext/mds.js", //
               ], */
               //move: [{ source: "dist-ext/chrome/js/mds.js", destination: "dist-ext/mds.js" }],
               copy: [
                  { source: "package.dist.json", destination: "dist-ext/dist/package.json" },
   
               ],
               //move: [{ source: "dist-ext/content-script-no.js", destination: "dist-ext/chrome-no/js/content-script.js" }],
               //mkdir: ["/path/to/directory/", "/another/directory/"],
               archive: [
                  { source: "dist-ext/dist", destination: "dist-ext/" + appName + ".zip" },
               ],
            },
         },
      }),
      new webpack.BannerPlugin({
         banner: "#!/usr/bin/env node",
         raw: true,
         include: [/(cli|server)/], //包含哪些文件需要添加头部
      }),
   ],
   optimization: {
      minimize: isProduction ? true : false,
      minimizer: [
         new TerserPlugin({
            extractComments: false, //不将注释提取到单独的文件中
         }),
      ],
   },
};

module.exports = () => {
   if (isProduction) {
      config.mode = "production";

      //config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
   } else {
      config.mode = "development";
   }
   return config;
};
