const PUBLIC_PATH = require("path").join(__dirname, "out/bundle");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//  .BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  optimization: {
    usedExports: true,
  },
  entry: "./app/js/index.js",
  output: {
    path: PUBLIC_PATH,
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          { loader: "postcss-loader" },
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
    ],
  },
  //  plugins: [new BundleAnalyzerPlugin()],
};
