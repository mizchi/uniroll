import unified from "unified";
import visit from "unist-util-visit";

export const codeExtractor: unified.Plugin = (options: any = {}) => {
  return (tree, file) => {
    visit(tree, "code", (node: any, index, parent) => {
      const [lang, suffix] = (node.lang || "").split(":");

      // console.log("ex", node, file);
      file.data ||= {};
      if (suffix.startsWith("@")) {
        file.data.entries ||= [];
        file.data.entries.push({
          lang,
          runner: suffix,
          content: node.value,
        });
      } else {
        file.data.files ||= {};
        file.data.files[suffix] = node.value;
      }
    });
  };
};
