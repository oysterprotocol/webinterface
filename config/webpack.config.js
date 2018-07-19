"use strict";

//Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const eslintFormatter = require("react-dev-utils/eslintFormatter");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const path = require("path");
const merge = require("webpack-merge");
const paths = require("./paths");
const getClientEnvironment = require("./env");

const APP_VERSION = "0.0.1";
const publicPath = ""; //paths.servedPath;
const generateStatsFile = process.env.GENERATE_STATS_FILE !== "false";
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

const common = {
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: "pre",
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve("eslint")
            },
            loader: require.resolve("eslint-loader")
          }
        ],
        include: paths.appSrc
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[ext]"
            }
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              compact: true
            }
          },
          {
            test: /\.tsx?$/,
            use: ["awesome-typescript-loader"]
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../"
                }
              },
              "css-loader"
            ]
          },
          {
            test: /worker\.js$/,
            use: {
              loader: "worker-loader",
              options: {
                name: "[name].[ext]",
                publicPath: "src/redux/workers/"
              }
            }
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[ext]"
            }
          }
        ]
      }
    ]
  }
};
// end common configuration

if (env.stringified["process.env"].NODE_ENV === '"production"') {
  module.exports = merge(common, {
    bail: true,
    devtool: "cheap-module-source-map",
    entry: paths.appSrc + "/index.js",
    output: {
      path: paths.appBuild,
      filename: `static/js/oyster-webnode-${APP_VERSION}.min.js`,
      chunkFilename: "static/js/[name].chunk.js",
      publicPath: publicPath,
      devtoolModuleFilenameTemplate: info =>
        path
          .relative(paths.appSrc, info.absoluteResourcePath)
          .replace(/\\/g, "/")
    },
    resolve: {
      modules: ["node_modules", paths.appNodeModules].concat(
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: [".web.js", ".mjs", ".js", ".json", ".web.jsx", ".jsx"],
      plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])]
    },
    plugins: [
      new BundleAnalyzerPlugin({
        generateStatsFile: generateStatsFile
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[id].[hash].css"
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
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
        }
      }),
      new ManifestPlugin({
        fileName: "asset-manifest.json"
      }),
      new ScriptExtHtmlWebpackPlugin({
        custom: [
          {
            test: /.js$/,
            attribute: "data-eth-address",
            value: "0xD1833A50f411432aD38E8374df8Cfff79e743788"
          }
        ]
      }),
      new SWPrecacheWebpackPlugin({
        // By default, a cache-busting query parameter is appended to requests
        // used to populate the caches, to ensure the responses are fresh.
        // If a URL is already hashed by Webpack, then there is no concern
        // about it being stale, and the cache-busting can be skipped.
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: "service-worker.js",
        logger(message) {
          if (message.indexOf("Total precache size is") === 0) {
            // This message occurs for every build and is a bit too noisy.
            return;
          }
          if (message.indexOf("Skipping static resource") === 0) {
            // This message obscures real errors so we ignore it.
            // https://github.com/facebookincubator/create-react-app/issues/2612
            return;
          }
          console.log(message);
        },
        minify: true,
        navigateFallback: publicUrl + "/index.html",
        // Ignores URLs starting from /__ (useful for Firebase):
        // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
        navigateFallbackWhitelist: [/^(?!\/__).*/],
        // Don't precache sourcemaps (they're large) and build asset manifest:
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
      }),
      new InterpolateHtmlPlugin(env.raw)
    ]
  });
}
// end production configuration

if (env.stringified["process.env"].NODE_ENV === '"development"') {
  module.exports = merge(common, {
    devServer: {
      port: 3001,
      open: true,
      historyApiFallback: true
    },
    devtool: "source-map",
    entry: paths.appIndexJs,
    output: {
      filename: "static/js/[name].bundle.[hash:8].js",
      chunkFilename: "static/js/[name].chunk.[chunkhash:8].js"
    },
    resolve: {
      extensions: [".web.js", ".mjs", ".js", ".json", ".web.jsx", ".jsx", '.tsx', '.ts']
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new InterpolateHtmlPlugin(env.raw)
    ]
  });
}
// end development configuration
