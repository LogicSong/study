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

#### optimization

webpack4开始存在的优化配置项，以下是重要的常用的配置项

```js
optimization: {
    minimize: true, // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle。
    minimizer: [
        // 允许你通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)
        new TerserPlugin({
            parallel: true,
            test: /\.js(\?.*)?$/i,// 匹配需要压缩的文件
            include: String|RegExp|Array<String|RegExp>, // 默认值undifined.匹配文件
            exclude: String|RegExp|Array<String|RegExp>, // 排除文件
            parallel: Boolean|Number, // 默认值true，使用多进程并发运行以提高构建速度。 并发运行的默认数量：os.cpus().length - 1
            terserOptions: {
                minify: ,

            }
        })
    ]
  },
};
```

#### Chunk VS Module VS Bundle

##### Module

首先来说module，Webpack可以看做是模块打包机，我们编写的任何文件，对于Webpack来说，都是一个个模块。所以Webpack的配置文件，有一个module字段，module下有一个rules字段，rules下有就是处理模块的规则，配置哪类的模块，交由哪类loader来处理。

##### Chunk

Chunk是Webpack打包过程中，一堆module的集合。我们知道Webpack的打包是从一个入口文件开始，也可以说是入口模块，入口模块引用这其他模块，模块再引用模块。Webpack通过引用关系逐个打包模块，这些module就形成了一个Chunk。
如果我们有多个入口文件，可能会产出多条打包路径，一条路径就会形成一个Chunk。出了入口entry会产生Chunk，还有两种途径，下面会有介绍。

**产生Chunk的三种途径**
1. entry入口
2. 异步加载模块：异步加载的模块，也能够生成Chunk。
3. 代码分割（code spliting）

##### Bundle

Bundle就是我们最终输出的一个或多个打包文件。确实，大多数情况下，一个Chunk会生产一个Bundle。但有时候也不完全是一对一的关系，比如我们把 devtool配置成'source-map'。这时就会打包出两个文件即bundle，但他们同属一个Chunk。


### webpack优化

#### 相关概念

- hash: 每次wepack构建时会生成一个唯一的hash值。
问题: 因为js和css同时使用一个hash值。如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
- chunkhash: 根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
问题: js和css的hash值还是一样的。因为css是在js中被引入的，所以同属于一个chunk
- contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样
让代码上线运行缓存更好使用

#### 生产环境性能优化

##### 优化打包构建速度

> 首先使用speed-measure-webpack-plugin插件分析打包速度，找出耗时的操作

- oneOf
在加载loader时候，默认每个文件都会被所有的rules检查，但我们很多文件都只需要一条rules就可以解析完成，这无疑减慢了打包效率，因此可以考虑使用rules的oneOf规则，可以保证文件从oneOf里面的规则从上到下检查，满足一个rule之后就可以不进行下面的loader（需要做好顺序，而且不能同一个文件需要两个loader规则同时处理。
所以如果有文件都需要不同的rule处理的时候把其中一个loader提取到oneOf外面，就可以了
比如对于js文件的eslint-loader和babelloader，我们考虑把先执行的eslint-loader放到oneOf的上方就可以了。

- 缩⼩Loader校验的⽂件范围：test、include、exclude三个配置项来缩⼩loader的处理范围，推荐include

- 使用缓存，可以说以空间换时间，具体方法有：
    - babel(解决js兼容性问题)缓存: 让第二次打包构建速度更快。
    ```js
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    corejs: { version: 3 },
                    targets: {
                    chrome: '60',
                    firefox: '50'
                    }
                }
            ]
        ],
        // 开启babel缓存
        // 第二次构建时，会读取之前的缓存
        cacheDirectory: true
        }
    }
    ```
    - 使用`HardSourceWebpackPlugin`对前一次打包进行缓存
- 多进程打包:thread-loader、terser-plugin：terser-plugin开启首先需要安装(webpack v5自带，v4需要手动安装)
- externals 
react react-dom可以放心的external掉
- dll 动态链接库
可以将可以共享，并且不经常改变的代码，抽取成一个共享的库;

##### 优化代码运行的性能(优化页面打开的速度)

- 利用缓存(hash-chunkhash-contenthash)
- tree shaking(webpack自带)
- code split
- 懒加载/预加载: 
    - 懒加载--import.then()
    - 预加载--(webpack)preFetch/preLoad
- scope hoisting: optimization.concatenateModules = true开启scope hoisting,告知 webpack 去寻找模块图形中的片段，哪些是可以安全地被合并到单一模块中。在生产模式下默认被启用

### code spliting

[code spliting](https://juejin.cn/post/6844904103848443912)

现在工程项目中，实现高性能应用的其中重要的一点就是让用户每次只加载必要的资源，优先级别不太高的资源采用延迟加载等技术渐进地进行加载获取。
Webpack 作为打包工具所特有的一项技术就是代码分片技术，通过这项技术我们可以把代码按照特定的形式进行拆分，使用按需加载资源，不必要全部加载下来。
代码分片可以有效降低首屏加载资源的大小，但是我们同时又面临着其他问题，比如如何对项目模块进行分片，分片后的资源如何进行管理等等。这也就是我们要解决的问题。

```js
splitChunks: {
    // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
    chunks: "async",
    // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。webpack5默认改为了20000
    minSize: 30000,
    // 使用 maxSize（每个缓存组 optimization.splitChunks.cacheGroups[x].maxSize 全局使用 optimization.splitChunks.maxSize 或对后备缓存组 optimization.splitChunks.fallbackCacheGroup.maxSize 使用）告诉 webpack 尝试将大于 maxSize 个字节的 chunk 分割成较小的部分。 这些较小的部分在体积上至少为 minSize（仅次于 maxSize）。 
    // maxSize 比 maxInitialRequest/maxAsyncRequests 具有更高的优先级。实际优先级是 maxInitialRequest/maxAsyncRequests < maxSize < minSize。
    // 设置 maxSize 的值会同时设置 maxAsyncSize 和 maxInitialSize 的值。
    maxSize: 0,
    // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
    minChunks: 1,
    // 表示按需加载文件时，并行请求的最大数目。默认为5。
    maxAsyncRequests: 5,
    // 表示加载入口文件时，并行请求的最大数目。默认为3。
    maxInitialRequests: 3,
    // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
    automaticNameDelimiter: '~',
    // 设置chunk的文件名。默认为true。当为true时，splitChunks基于chunk和cacheGroups的key自动命名。
    name: true,
    // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块，就分配到该组。模块可以被多个组引用，但最终会根据priority来决定打包到哪个组中。默认将所有来自 node_modules目录的模块打包至vendors组，将两个以上的chunk所共享的模块打包至default组。
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        // 
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```



**[17项关于webpack的性能优化](https://juejin.cn/post/6951297954770583565)**