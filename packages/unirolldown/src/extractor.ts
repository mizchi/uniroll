import { VFile } from "vfile";
import unified from "unified";
import visit from "unist-util-visit";
import type { VFileExtended } from "./types";
import qs from "querystring";

export const extractor: unified.Plugin = (options: any = {}) => {
  return (tree, _file: VFile) => {
    const file = _file as VFileExtended;
    visit(tree, "code", (node: any, index, parent) => {
      const [lang, suffix] = (node.lang || "").split(":");
      node.lang = lang;
      node.data ??= {};
      if (suffix.startsWith("@")) {
        const [env, query] = suffix.split("?") ?? [];
        const params = query ? qs.parse(query) : {};
        // throw query;
        node.data.isRunner = true;
        node.data.runner = {
          env,
          params: { ...params },
        };
      } else {
        file.data.files[suffix] = node.value;
      }
    });
  };
};
