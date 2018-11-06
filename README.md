# gulp-weapp-cli

> 基于gulp的快速构建微信小程序的脚手架工具

## 特性

* sass编写样式，替代wxss
* webfont自动base64转换，解决了微信小程序无法引用本地字体的问题
* 采用es6语法开发，babel编译
* 图片压缩
* 区分开发生产两套环境，支持生产环境打包
* 本地数据mock功能

## 安装

Using npm:
``` bash
$ npm install -g gulp-weapp-cli
```
or using yarn:
``` bash
$ yarn global add gulp-weapp-cli
```

## 使用

``` bash
# 已经进行了上述安装步骤
$ gwc init <project-name>

# 没有进行上述安装步骤，可以通过npx使用
$ npx gulp-weapp-cli init <project-name>
```

## 目录结构

```
├── client            // 小程序 client 部分，主要编写内容
│   ├── app.js
│   ├── app.json
│   ├── app.scss
│   ├── project.config.json  // 小程序项目配置
│   ├── components   // 自定义组件
│   ├── images       // 图片资源
│   ├── lib
|   │   ├──regenerator-runtime // async await 解决方案，在需要的文件内引入runtime-module.js即可
│   │   │  ├── runtime.js
│   │   │  ├── runtime-module.js
│   │   │  ├── path.js
│   │   │  ├── README.md
│   │   │  └── package.json
│   │   ├── api-mock.js   // api-mock 功能
│   │   ├── api.js       // 实际 api
│   │   └── util.js
│   └── pages
│       └── index
├── server           // 小程序 server 部分，主要是静态资源和云函数
│   ├── cloud-functions
│   │   ├── test
│   │   └── test2
│   ├── index.js
│   ├── inline    // 云函数公共模块，打包的时候会 inline 进引入的云函数
│   │   └── utils.js
│   └── static
│       └── gulp.png
├── test         // 测试文件夹
│   └── functions  // 存储小程序云测试用的参数模板
│       └── test.json
├── config.server.json
├── dist  // 产出文件夹，通过微信开发者工具打开预览效果
├── gulpfile.js
├── package.json
├── README.md
├── .babelrc
├── .editorconfig
├── .eslintignore
├── .eslintrc
└── .gitignore
```

## License

[MIT](https://github.com/kindboy/gulp-WeApp-cli/blob/master/LICENSE)