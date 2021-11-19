# 玩转webpack

>练习环境为webpack@4.35.3,webpack-cli@3.3.5

## 了解webpack

### webpack是什么

>本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。---webpack官网

### 作用是什么

- 转换ES6语法
- 转换jsx、vue
- css前缀补全/预处理器
- 压缩混淆
- 图片压缩

### 使用步骤

#### 安装
以webpack4为例：
`yarn add webpack webpack@4.35.3 webpack-cli@3.3.5 --dev`
安装完成后运行`./node_modules/.bin/webpack -v`可以查看安装版本

#### 添加配置文件
webpack的默认配置文件为主目录下的webpack.config.js。

#### 新增源代码及html文件

#### 运行打包

打包命令`./node_modules/.bin/webpack`
简化打包：
在package.json中的scripts下添加：`build: webpack`
**原理：模块局部安装会在node_modules/.bin目录创建软连接，在scripts中运行时会去node_modules/.bin目录下去寻找。**

### 基本概念及其配置

webpack主要有五大概念：entry, output, loader, plugin, mode。

#### Entry(入口)

**webpack打包的入口。**

entry两种配置方式：
- entry: 'src/index.js'
- entry: {
    pageOne: 'src/pageOne.js',
    pageTwo: 'src/pageTwo
}

#### Output(输出)

指定webpack的输出路径。注意，虽然可以存在多个 entry 起点，但只能指定一个 output 配置。

output配置方式：
```js
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
}
```

#### Loader

通过 loader，webpack 可以支持以各种语言和预处理器语法编写的模块。loader 描述了 webpack 如何处理 非 JavaScript _模块_，并且在 bundle 中引入这些_依赖_。

```js
module: {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader'
        }
    ]
}
```

#### Plugin

插件是 webpack 的 支柱 功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！
插件目的在于解决 loader 无法实现的其他事。

#### mode 

提供 mode 配置选项，告知 webpack 使用相应环境的内置优化。默认值为production。
