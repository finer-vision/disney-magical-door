const path = require("path");

module.exports = {
  apps: [
    {
      name: "disney-magical-door",
      script: path.resolve(__dirname, "server", "build", "index.js"),
    },
  ],
};
