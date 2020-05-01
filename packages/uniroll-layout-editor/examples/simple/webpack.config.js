const path = require("path");
const config = require("../../../../webpack.shared.config");
module.exports = {
  ...config,
  entry: path.join(__dirname, "index.tsx"),
};
