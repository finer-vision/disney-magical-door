import * as path from "path";
import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";

const DEV_MODE = process.env.NODE_ENV === "development";
const SRC_DIR = path.resolve(__dirname, "src");
const BUILD_DIR = path.resolve(__dirname, "build");

const config = {
  mode: DEV_MODE ? "development" : "production",
  target: "node",
  stats: "minimal",
  entry: path.join(SRC_DIR, "index.ts"),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    filename: "index.js",
    path: BUILD_DIR,
    clean: true,
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
};

export default () => {
  if (!DEV_MODE) {
    // Modify config for production
  }
  return config;
};
