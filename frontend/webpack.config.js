"use strict";
const version = require("../package.json").version;
const path = require("path");
const modules_path = path.resolve(__dirname, "./_build");
const argv = require("yargs").argv;
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

let mode = "development";

const performance = {
    hints: false,
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
};

let devtool = "cheap-module-source-map";

if (argv.production) {
    performance.hints = "warning";
    mode = "production";
    devtool = undefined;

}

const tsconfig = require.resolve("./tsconfig.json");
const devMode = mode === "development";

const minifyOptions = devMode
    ? {}
    : {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /\.(js|chunk)$/,
            terserOptions: {
                ecma: 5,
                compress: {
                    drop_console: true,
                },
            },
        })],
    };

// const smp = new SpeedMeasurePlugin();


const config = {
    mode,
    target: "web",
    devtool: devtool,
    entry: ["./js/index.tsx"],
    output: {
        filename: "bundle.js",
        path: modules_path,
        strictModuleExceptionHandling: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [
            new TsconfigPathsPlugin({/* options: see below */})
        ],
        modules: ["node_modules"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [
                    path.resolve(__dirname, "_build"),
                ],
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                sourceMap: devMode,
                            },
                            onlyCompileBundledFiles: true,
                            configFile: tsconfig,
                        },
                    },
                ],
            },

        ],
    },
    watchOptions: {
        poll: 500,
        ignored: /node_modules/,
    },
    performance,
    optimization: {
        removeEmptyChunks: true,
        // собираем весь CSS в один чанк
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "styles",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
        ...minifyOptions,
    },
    plugins: [
    ],
    stats: {
        timings: true,
        children: false,
    },
};

module.exports = config;
