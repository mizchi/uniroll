const { bundle } = require("uniroll-light/dist/index.cjs.js");

bundle({
  input: "/index.js",
  files: {
    "/index.js": 'console.log("xxx")',
  },
}).then(async (mod) => {
  console.log("xxx", mod);
});
