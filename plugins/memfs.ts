import path from "path";

const PREFIX = `memfs:`;
const DEFAULT_EXTENSIONS = [".tsx", ".ts", ".js", ".json"];

export default function memfs(
  files: { [k: string]: string },
  options?: {
    extensions?: string[];
    transform?: (filename: string, value: string) => string;
  }
) {
  return {
    name: "memfs",
    resolveId(id: string, importer: any) {
      // console.log("[resolveId:input]", id, importer);
      if (importer?.startsWith(PREFIX)) {
        importer = importer.slice(PREFIX.length);
        const resolvedId = path.resolve(path.dirname(importer), id);
        const idWithExt = findFile(files, resolvedId, options?.extensions);
        if (idWithExt) {
          return PREFIX + idWithExt;
        }
      }

      const newId = findFile(files, id, options?.extensions);
      if (newId) {
        return PREFIX + newId;
      }
    },

    load(id: string) {
      // console.log("virtual load id", id);
      if (id.startsWith(PREFIX)) {
        const fpath = id.slice(PREFIX.length);
        const rawValue = files[fpath];
        if (options?.transform) {
          return options.transform(fpath, rawValue);
        } else {
          return rawValue;
        }
      }
    }
  };
}

function findFile(
  files: { [k: string]: string },
  id: string,
  extensions: string[] = DEFAULT_EXTENSIONS
): string | void {
  if (files[id]) {
    return id;
  }

  const reg = new RegExp(path.extname(id) + "$");
  const base = id.replace(reg, "");
  for (const ext of extensions) {
    const p = base + ext;
    if (files[p]) {
      return p;
    }
  }
}
