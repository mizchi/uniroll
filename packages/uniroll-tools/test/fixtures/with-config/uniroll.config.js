// const { svelte } = require("rollup-plugin-uniroll-svelte");
const ts = require("typescript");

module.exports = {
  target: ts.ScriptTarget.ES5,
  // extraPlugins: [svelte()],
};
