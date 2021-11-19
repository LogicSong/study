### cra开发环境webpack配置
```js
{
  mode: 'development',
  bail: false,
  devtool: 'cheap-module-source-map',
  entry: 'C:\\project\\react-template\\src\\index.js',
  output: {
    path: undefined,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    futureEmitAssets: true,
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: [Function (anonymous)],
    jsonpFunction: 'webpackJsonpreact-demo',
    globalObject: 'this'
  },
  optimization: {
    minimize: false,
    minimizer: [
      TerserPlugin {
        options: {
          test: /\.[cm]?js(\?.*)?$/i,
          extractComments: true,
          sourceMap: true,
          cache: true,
          cacheKeys: [Function: cacheKeys],
          parallel: true,
          include: undefined,
          exclude: undefined,
          minify: undefined,
          terserOptions: {
            parse: { ecma: 8 },
            compress: { ecma: 5, warnings: false, comparisons: false, inline: 2 },
            mangle: { safari10: true },
            keep_classnames: false,
            keep_fnames: false,
            output: { ecma: 5, comments: false, ascii_only: true }
          }
        }
      },
      OptimizeCssAssetsWebpackPlugin {
        pluginDescriptor: { name: 'OptimizeCssAssetsWebpackPlugin' },
        options: {
          assetProcessors: [
            {
              phase: 'compilation.optimize-chunk-assets',
              regExp: /\.css(\?.*)?$/i,
              processor: [Function: processor]
            }
          ],
          canPrint: undefined,
          assetNameRegExp: /\.css(\?.*)?$/i,
          cssProcessor: [Function: creator] { process: [Function (anonymous)] },
          cssProcessorOptions: {
            parser: [Function: safeParse],
            map: { inline: false, annotation: true }
          },
          cssProcessorPluginOptions: {
            preset: [
              'default',
              { minifyFontValues: { removeQuotes: false } }
            ]
          }
        },
        phaseAssetProcessors: {
          'compilation.optimize-chunk-assets': [
            {
              phase: 'compilation.optimize-chunk-assets',
              regExp: /\.css(\?.*)?$/i,
              processor: [Function: processor]
            }
          ],
          'compilation.optimize-assets': [],
          emit: []
        },
        deleteAssetsMap: {}
      }
    ],
    splitChunks: { chunks: 'all', name: true },
    runtimeChunk: { name: [Function: name] }
  },
  resolve: {
    modules: [ 'node_modules', 'C:\\project\\react-template\\node_modules' ],
    extensions: [
      '.web.mjs', '.mjs',
      '.web.js',  '.js',
      '.json',    '.web.jsx',
      '.jsx'
    ],
    alias: { 'react-native': 'react-native-web' },
    plugins: [
      {
        apply: [Function: nothing],
        makePlugin: [Function (anonymous)],
        moduleLoader: [Function (anonymous)],
        topLevelLoader: { apply: [Function: nothing] },
        bind: [Function (anonymous)],
        tsLoaderOptions: [Function (anonymous)],
        forkTsCheckerOptions: [Function (anonymous)]
      },
      ModuleScopePlugin {
        appSrcs: [ 'C:\\project\\react-template\\src' ],
        allowedFiles: Set(2) {
          'C:\\project\\react-template\\package.json',
          'C:\\project\\react-template\\node_modules\\react-dev-utils\\refreshOverlayInterop.js'
        }
      }
    ]
  },
  resolveLoader: { plugins: [ { apply: [Function: nothing] } ] },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: [ /\.avif$/ ],
            loader: 'C:\\project\\react-template\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 10000,
              mimetype: 'image/avif',
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
            loader: 'C:\\project\\react-template\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: 'C:\\project\\react-template\\src',
            loader: 'C:\\project\\react-template\\node_modules\\react-scripts\\node_modules\\babel-loader\\lib\\index.js',
            options: {
              customize: 'C:\\project\\react-template\\node_modules\\babel-preset-react-app\\webpack-overrides.js',
              presets: [
                [
                  'C:\\project\\react-template\\node_modules\\babel-preset-react-app\\index.js',
                  { runtime: 'automatic' }
                ]
              ],
              babelrc: true,
              configFile: false,
              cacheIdentifier: 'development:babel-plugin-named-asset-import@:babel-preset-react-app@10.0.0:react-dev-utils@11.0.4:react-scripts@4.0.3',
              plugins: [
                [
                  'C:\\project\\react-template\\node_modules\\react-scripts\\node_modules\\babel-plugin-named-asset-import\\index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]'
                      }
                    }
                  }
                ],
                'C:\\project\\react-template\\node_modules\\react-refresh\\babel.js',
                [
                  '@babel/plugin-proposal-decorators',
                  { legacy: true }
                ],
                [
                  'import',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css'
                  },
                  'fix-import-imports'
                ]
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false
            }
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: 'C:\\project\\react-template\\node_modules\\react-scripts\\node_modules\\babel-loader\\lib\\index.js',
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  'C:\\project\\react-template\\node_modules\\babel-preset-react-app\\dependencies.js',
                  { helpers: true }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: false,
              cacheIdentifier: 'development:babel-plugin-named-asset-import@:babel-preset-react-app@10.0.0:react-dev-utils@11.0.4:react-scripts@4.0.3',
              sourceMaps: true,
              inputSourceMap: true
            }
          },
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: [
              'C:\\project\\react-template\\node_modules\\style-loader\\dist\\cjs.js',
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: { importLoaders: 1, sourceMap: true }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              }
            ],
            sideEffects: true
          },
          {
            test: /\.module\.css$/,
            use: [
              'C:\\project\\react-template\\node_modules\\style-loader\\dist\\cjs.js',
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                  modules: { getLocalIdent: [Function: getLocalIdent] }
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              }
            ]
          },
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: [
              'C:\\project\\react-template\\node_modules\\style-loader\\dist\\cjs.js',
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: { importLoaders: 3, sourceMap: true }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\resolve-url-loader\\index.js',
                options: {
                  sourceMap: true,
                  root: 'C:\\project\\react-template\\src'
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\sass-loader\\dist\\cjs.js',
                options: { sourceMap: true }
              }
            ],
            sideEffects: true
          },
          {
            test: /\.module\.(scss|sass)$/,
            use: [
              'C:\\project\\react-template\\node_modules\\style-loader\\dist\\cjs.js',
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  importLoaders: 3,
                  sourceMap: true,
                  modules: { getLocalIdent: [Function: getLocalIdent] }
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\resolve-url-loader\\index.js',
                options: {
                  sourceMap: true,
                  root: 'C:\\project\\react-template\\src'
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\sass-loader\\dist\\cjs.js',
                options: { sourceMap: true }
              }
            ]
          },
          {
            loader: 'C:\\project\\react-template\\node_modules\\file-loader\\dist\\cjs.js',
            exclude: [ /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/ ],
            options: { name: 'static/media/[name].[hash:8].[ext]' }
          }
        ]
      }
    ]
  },
  plugins: [
    HtmlWebpackPlugin {
      options: {
        template: 'C:\\project\\react-template\\public\\index.html',
        templateContent: false,
        templateParameters: [Function: templateParametersGenerator],
        filename: 'index.html',
        publicPath: 'auto',
        hash: false,
        inject: true,
        scriptLoading: 'blocking',
        compile: true,
        favicon: false,
        minify: 'auto',
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: 'auto',
        meta: {},
        base: false,
        title: 'Webpack App',
        xhtml: false
      },
      childCompilerHash: undefined,
      assetJson: undefined,
      hash: undefined,
      version: 4
    },
    InterpolateHtmlPlugin {
      htmlWebpackPlugin: [class HtmlWebpackPlugin] {
        version: 4,
        getHooks: [Function: getHtmlWebpackPluginHooks],
        createHtmlTagObject: [Function: createHtmlTagObject]
      },
      replacements: {
        NODE_ENV: 'development',
        PUBLIC_URL: '',
        WDS_SOCKET_HOST: undefined,
        WDS_SOCKET_PATH: undefined,
        WDS_SOCKET_PORT: undefined,
        FAST_REFRESH: true
      }
    },
    ModuleNotFoundPlugin {
      appPath: 'C:\\project\\react-template',
      yarnLockFile: undefined,
      useYarnCommand: [Function: bound useYarnCommand],
      getRelativePath: [Function: bound getRelativePath],
      prettierError: [Function: bound prettierError]
    },
    DefinePlugin {
      definitions: {
        'process.env': {
          NODE_ENV: '"development"',
          PUBLIC_URL: '""',
          WDS_SOCKET_HOST: undefined,
          WDS_SOCKET_PATH: undefined,
          WDS_SOCKET_PORT: undefined,
          FAST_REFRESH: 'true'
        }
      }
    },
    HotModuleReplacementPlugin {
      options: {},
      multiStep: undefined,
      fullBuildTimeout: 200,
      requestTimeout: 10000
    },
    ReactRefreshPlugin {
      options: {
        overlay: {
          entry: 'C:\\project\\react-template\\node_modules\\react-dev-utils\\webpackHotDevClient.js',
          module: 'C:\\project\\react-template\\node_modules\\react-dev-utils\\refreshOverlayInterop.js',
          sockIntegration: false
        },
        exclude: /node_modules/i,
        include: /\.([jt]sx?|flow)$/i
      }
    },
    CaseSensitivePathsPlugin {
      options: {},
      logger: Object [console] {
        log: [Function: log],
        warn: [Function: warn],
        dir: [Function: dir],
        time: [Function: time],
        timeEnd: [Function: timeEnd],
        timeLog: [Function: timeLog],
        trace: [Function: trace],
        assert: [Function: assert],
        clear: [Function: clear],
        count: [Function: count],
        countReset: [Function: countReset],
        group: [Function: group],
        groupEnd: [Function: groupEnd],
        table: [Function: table],
        debug: [Function: debug],
        info: [Function: info],
        dirxml: [Function: dirxml],
        error: [Function: error],
        groupCollapsed: [Function: groupCollapsed],
        Console: [Function: Console],
        profile: [Function: profile],
        profileEnd: [Function: profileEnd],
        timeStamp: [Function: timeStamp],
        context: [Function: context]
      },
      pathCache: {},
      fsOperations: 0,
      primed: false
    },
    WatchMissingNodeModulesPlugin {
      nodeModulesPath: 'C:\\project\\react-template\\node_modules'
    },
    ManifestPlugin {
      opts: {
        publicPath: '/',
        basePath: '',
        fileName: 'asset-manifest.json',
        transformExtensions: /^(gz|map)$/i,
        writeToFileEmit: false,
        seed: null,
        filter: null,
        map: null,
        generate: [Function: generate],
        sort: null,
        serialize: [Function: serialize]
      }
    },
    IgnorePlugin {
      options: { resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ },
      checkIgnore: [Function: bound checkIgnore]
    },
    ESLintWebpackPlugin {
      key: 'ESLintWebpackPlugin',
      options: {
        extensions: [ 'js', 'mjs', 'jsx', 'ts', 'tsx' ],
        emitError: true,
        emitWarning: true,
        failOnError: true,
        formatter: 'C:\\project\\react-template\\node_modules\\react-dev-utils\\eslintFormatter.js',
        eslintPath: 'C:\\project\\react-template\\node_modules\\eslint\\lib\\api.js',
        context: 'C:\\project\\react-template\\src',
        cache: true,
        cacheLocation: 'C:\\project\\react-template\\node_modules\\.cache\\.eslintcache',
        cwd: 'C:\\project\\react-template',
        resolvePluginsRelativeTo: 'C:\\project\\react-template\\node_modules\\react-scripts\\config',
        baseConfig: {
          extends: [
            'C:\\project\\react-template\\node_modules\\eslint-config-react-app\\base.js'
          ],
          rules: {}
        }
      },
      run: [Function: bound run] AsyncFunction
    }
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  performance: false
}
```
### cra生产环境webpack配置
```js
{
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: 'C:\\project\\react-template\\src\\index.js',
  output: {
    path: 'C:\\project\\react-template\\build',
    pathinfo: false,
    filename: 'static/js/[name].[contenthash:8].js',
    futureEmitAssets: true,
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: [Function (anonymous)],
    jsonpFunction: 'webpackJsonpreact-demo',
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
    minimizer: [
      TerserPlugin {
        options: {
          test: /\.[cm]?js(\?.*)?$/i,
          extractComments: true,
          sourceMap: true,
          cache: true,
          cacheKeys: [Function: cacheKeys],
          parallel: true,
          include: undefined,
          exclude: undefined,
          minify: undefined,
          terserOptions: {
            parse: { ecma: 8 },
            compress: { ecma: 5, warnings: false, comparisons: false, inline: 2 },
            mangle: { safari10: true },
            keep_classnames: false,
            keep_fnames: false,
            output: { ecma: 5, comments: false, ascii_only: true }
          }
        }
      },
      OptimizeCssAssetsWebpackPlugin {
        pluginDescriptor: { name: 'OptimizeCssAssetsWebpackPlugin' },
        options: {
          assetProcessors: [
            {
              phase: 'compilation.optimize-chunk-assets',
              regExp: /\.css(\?.*)?$/i,
              processor: [Function: processor]
            }
          ],
          canPrint: undefined,
          assetNameRegExp: /\.css(\?.*)?$/i,
          cssProcessor: [Function: creator] { process: [Function (anonymous)] },
          cssProcessorOptions: {
            parser: [Function: safeParse],
            map: { inline: false, annotation: true }
          },
          cssProcessorPluginOptions: {
            preset: [
              'default',
              { minifyFontValues: { removeQuotes: false } }
            ]
          }
        },
        phaseAssetProcessors: {
          'compilation.optimize-chunk-assets': [
            {
              phase: 'compilation.optimize-chunk-assets',
              regExp: /\.css(\?.*)?$/i,
              processor: [Function: processor]
            }
          ],
          'compilation.optimize-assets': [],
          emit: []
        },
        deleteAssetsMap: {}
      }
    ],
    splitChunks: { chunks: 'all', name: false },
    runtimeChunk: { name: [Function: name] }
  },
  resolve: {
    modules: [ 'node_modules', 'C:\\project\\react-template\\node_modules' ],
    extensions: [
      '.web.mjs', '.mjs',
      '.web.js',  '.js',
      '.json',    '.web.jsx',
      '.jsx'
    ],
    alias: { 'react-native': 'react-native-web' },
    plugins: [
      {
        apply: [Function: nothing],
        makePlugin: [Function (anonymous)],
        moduleLoader: [Function (anonymous)],
        topLevelLoader: { apply: [Function: nothing] },
        bind: [Function (anonymous)],
        tsLoaderOptions: [Function (anonymous)],
        forkTsCheckerOptions: [Function (anonymous)]
      },
      ModuleScopePlugin {
        appSrcs: [ 'C:\\project\\react-template\\src' ],
        allowedFiles: Set(2) {
          'C:\\project\\react-template\\package.json',
          'C:\\project\\react-template\\node_modules\\react-dev-utils\\refreshOverlayInterop.js'
        }
      }
    ]
  },
  resolveLoader: { plugins: [ { apply: [Function: nothing] } ] },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: [ /\.avif$/ ],
            loader: 'C:\\project\\react-template\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 10000,
              mimetype: 'image/avif',
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
            loader: 'C:\\project\\react-template\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: 'C:\\project\\react-template\\src',
            loader: 'C:\\project\\react-template\\node_modules\\react-scripts\\node_modules\\babel-loader\\lib\\index.js',
            options: {
              customize: 'C:\\project\\react-template\\node_modules\\babel-preset-react-app\\webpack-overrides.js',
              presets: [
                [
                  'C:\\project\\react-template\\node_modules\\babel-preset-react-app\\index.js',
                  { runtime: 'automatic' }
                ]
              ],
              babelrc: true,
              configFile: false,
              cacheIdentifier: 'production:babel-plugin-named-asset-import@:babel-preset-react-app@10.0.0:react-dev-utils@11.0.4:react-scripts@4.0.3',
              plugins: [
                [
                  'C:\\project\\react-template\\node_modules\\react-scripts\\node_modules\\babel-plugin-named-asset-import\\index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]'
                      }
                    }
                  }
                ],
                [
                  '@babel/plugin-proposal-decorators',
                  { legacy: true }
                ],
                [
                  'import',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css'
                  },
                  'fix-import-imports'
                ]
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: true
            }
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: 'C:\\project\\react-template\\node_modules\\react-scripts\\node_modules\\babel-loader\\lib\\index.js',
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  'C:\\project\\react-template\\node_modules\\babel-preset-react-app\\dependencies.js',
                  { helpers: true }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: false,
              cacheIdentifier: 'production:babel-plugin-named-asset-import@:babel-preset-react-app@10.0.0:react-dev-utils@11.0.4:react-scripts@4.0.3',
              sourceMaps: true,
              inputSourceMap: true
            }
          },
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: [
              {
                loader: 'C:\\project\\react-template\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {}
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: { importLoaders: 1, sourceMap: true }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              }
            ],
            sideEffects: true
          },
          {
            test: /\.module\.css$/,
            use: [
              {
                loader: 'C:\\project\\react-template\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {}
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                  modules: { getLocalIdent: [Function: getLocalIdent] }
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              }
            ]
          },
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: [
              {
                loader: 'C:\\project\\react-template\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {}
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: { importLoaders: 3, sourceMap: true }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\resolve-url-loader\\index.js',
                options: {
                  sourceMap: true,
                  root: 'C:\\project\\react-template\\src'
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\sass-loader\\dist\\cjs.js',
                options: { sourceMap: true }
              }
            ],
            sideEffects: true
          },
          {
            test: /\.module\.(scss|sass)$/,
            use: [
              {
                loader: 'C:\\project\\react-template\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {}
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  importLoaders: 3,
                  sourceMap: true,
                  modules: { getLocalIdent: [Function: getLocalIdent] }
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  ident: 'postcss',
                  plugins: [Function: plugins],
                  sourceMap: true
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\resolve-url-loader\\index.js',
                options: {
                  sourceMap: true,
                  root: 'C:\\project\\react-template\\src'
                }
              },
              {
                loader: 'C:\\project\\react-template\\node_modules\\sass-loader\\dist\\cjs.js',
                options: { sourceMap: true }
              }
            ]
          },
          {
            loader: 'C:\\project\\react-template\\node_modules\\file-loader\\dist\\cjs.js',
            exclude: [ /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/ ],
            options: { name: 'static/media/[name].[hash:8].[ext]' }
          }
        ]
      }
    ]
  },
  plugins: [
    HtmlWebpackPlugin {
      options: {
        template: 'C:\\project\\react-template\\public\\index.html',
        templateContent: false,
        templateParameters: [Function: templateParametersGenerator],
        filename: 'index.html',
        publicPath: 'auto',
        hash: false,
        inject: true,
        scriptLoading: 'blocking',
        compile: true,
        favicon: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        },
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: 'auto',
        meta: {},
        base: false,
        title: 'Webpack App',
        xhtml: false
      },
      childCompilerHash: undefined,
      assetJson: undefined,
      hash: undefined,
      version: 4
    },
    InlineChunkHtmlPlugin {
      htmlWebpackPlugin: [class HtmlWebpackPlugin] {
        version: 4,
        getHooks: [Function: getHtmlWebpackPluginHooks],
        createHtmlTagObject: [Function: createHtmlTagObject]
      },
      tests: [ /runtime-.+[.]js/ ]
    },
    InterpolateHtmlPlugin {
      htmlWebpackPlugin: [class HtmlWebpackPlugin] {
        version: 4,
        getHooks: [Function: getHtmlWebpackPluginHooks],
        createHtmlTagObject: [Function: createHtmlTagObject]
      },
      replacements: {
        NODE_ENV: 'production',
        PUBLIC_URL: '',
        WDS_SOCKET_HOST: undefined,
        WDS_SOCKET_PATH: undefined,
        WDS_SOCKET_PORT: undefined,
        FAST_REFRESH: true
      }
    },
    ModuleNotFoundPlugin {
      appPath: 'C:\\project\\react-template',
      yarnLockFile: undefined,
      useYarnCommand: [Function: bound useYarnCommand],
      getRelativePath: [Function: bound getRelativePath],
      prettierError: [Function: bound prettierError]
    },
    DefinePlugin {
      definitions: {
        'process.env': {
          NODE_ENV: '"production"',
          PUBLIC_URL: '""',
          WDS_SOCKET_HOST: undefined,
          WDS_SOCKET_PATH: undefined,
          WDS_SOCKET_PORT: undefined,
          FAST_REFRESH: 'true'
        }
      }
    },
    MiniCssExtractPlugin {
      options: {
        filename: 'static/css/[name].[contenthash:8].css',
        moduleFilename: [Function: moduleFilename],
        ignoreOrder: false,
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      }
    },
    ManifestPlugin {
      opts: {
        publicPath: '/',
        basePath: '',
        fileName: 'asset-manifest.json',
        transformExtensions: /^(gz|map)$/i,
        writeToFileEmit: false,
        seed: null,
        filter: null,
        map: null,
        generate: [Function: generate],
        sort: null,
        serialize: [Function: serialize]
      }
    },
    IgnorePlugin {
      options: { resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ },
      checkIgnore: [Function: bound checkIgnore]
    },
    ESLintWebpackPlugin {
      key: 'ESLintWebpackPlugin',
      options: {
        extensions: [ 'js', 'mjs', 'jsx', 'ts', 'tsx' ],
        emitError: true,
        emitWarning: true,
        failOnError: true,
        formatter: 'C:\\project\\react-template\\node_modules\\react-dev-utils\\eslintFormatter.js',
        eslintPath: 'C:\\project\\react-template\\node_modules\\eslint\\lib\\api.js',
        context: 'C:\\project\\react-template\\src',
        cache: true,
        cacheLocation: 'C:\\project\\react-template\\node_modules\\.cache\\.eslintcache',
        cwd: 'C:\\project\\react-template',
        resolvePluginsRelativeTo: 'C:\\project\\react-template\\node_modules\\react-scripts\\config',
        baseConfig: {
          extends: [
            'C:\\project\\react-template\\node_modules\\eslint-config-react-app\\base.js'
          ],
          rules: {}
        }
      },
      run: [Function: bound run] AsyncFunction
    }
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  performance: false
}
```