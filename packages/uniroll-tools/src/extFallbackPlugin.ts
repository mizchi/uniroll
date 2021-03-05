import type { Plugin } from "rollup";

import path from "path";
import fs from "fs";

const SEARCH_EXTENSIONS = [
  "/index.tsx",
  "/index.ts",
  "/index.js",
  ".tsx",
  ".ts",
  ".json",
  ".js",
];

function searchFile(filepath: string, extensions: string[]) {
  for (const ext of ["", ...extensions]) {
    if (fs.existsSync(filepath + ext)) {
      return filepath + ext;
    }
  }
}

const DEBUG = false;
const log = (...args: any) => {
  if (DEBUG) console.log(...args);
};

const isFileSchema = (id: string) =>
  id.startsWith("file://") || id.startsWith("/");

const isRelativePath = (id: string) => stripSchema(id).startsWith(".");
const stripSchema = (id: string) => id.replace(/^file\:(\/\/)?/, "");

export const extFallback = ({
  extensions = SEARCH_EXTENSIONS,
}: {
  extensions?: string[];
}) => {
  return {
    name: "uniroll-node-ext-fallback",
    resolveId(id: string, importer: string | undefined) {
      log("[rollup-plugin-virtual-fs]", id, importer);
      const normalized = stripSchema(id);
      if (isFileSchema(id) && importer == null) {
        return searchFile(normalized, extensions);
      }
      if (importer && isFileSchema(importer) && isRelativePath(id)) {
        const rawImporter = importer.replace(/^file\:/, "");
        const fullpath = rawImporter
          ? path.resolve(path.dirname(rawImporter), normalized)
          : id;
        const reslovedWithExt = searchFile(fullpath, extensions);
        if (reslovedWithExt) return reslovedWithExt;
        this.warn(`[rollup-plugin-virtual-fs] can not resolve id: ${fullpath}`);
      }
    },
  } as Plugin;
};
