import { Plugin } from "rollup";
import path from "path";

export type ImportMaps = {
  imports: { [k: string]: string };
};

function isHttpProtocol(id: string) {
  return id.startsWith("http://") || id.startsWith("https://");
}

const DEBUG = false;
const log = (...args: any) => DEBUG && console.log(...args);

const defaultCache = new Map();
export function httpResolve({
  cache = defaultCache,
  onRequest,
  onUseCache,
  fetcher,
  fallback,
}: {
  cache?: any;
  fetcher?: (url: string) => Promise<string>;
  onRequest?: (url: string) => void;
  onUseCache?: (url: string) => void;
  fallback?: (
    id: string,
    importer: string
  ) => string | void | Promise<string | void>;
}) {
  return {
    async resolveId(id: string, importer: string) {
      log(
        "[http-resolve:resolveId:enter]",
        id,
        "from",
        importer
        // rewriter?.toString()
      );

      // on network resolve
      if (importer && isHttpProtocol(importer)) {
        if (id.startsWith("https://")) {
          log("[http-reslove:end] return with https", id);
          return id;
        }
        const { pathname, protocol, host } = new URL(importer);
        if (id.startsWith("/")) {
          // /_/...
          log(
            "[http-reslove:end] return with host root",
            `${protocol}//${host}${id}`
          );
          return `${protocol}//${host}${id}`;
        } else if (id.startsWith(".")) {
          // ./xxx/yyy
          // relative path

          const resolvedPathname = path.join(path.dirname(pathname), id);
          const newId = `${protocol}//${host}${resolvedPathname}`;
          log("[http-reslove:end] return with relativePath", newId);
          return newId;
        }
      }
      if (fallback) {
        log("[http-reslove:end] use fallback to", id);
        const rewriten = await fallback(id, importer);
        if (rewriten) {
          console.log("rewrite", rewriten, "from", id);
          return rewriten;
        }
      }
    },
    async load(id: string) {
      log("[http-resolve:load]", id);
      if (isHttpProtocol(id)) {
        const cached = await cache.get(id);
        if (cached) {
          onUseCache?.(id);
          return cached;
        }
        onRequest?.(id);
        if (fetcher) {
          const code = await fetcher(id);
          await cache.set(id, code);
          return code;
        } else {
          const res = await fetch(id);
          if (!res.ok) {
            throw res.statusText;
          }
          const code = await res.text();
          await cache.set(id, code);
          return code;
        }
      }
    },
  } as Plugin;
}

export function createFallback(opts: {
  importmaps?: ImportMaps | (() => Promise<ImportMaps> | ImportMaps);
  onWarn?: (arg: any) => void;
}) {
  return async (id: string, importer: string | void = undefined) => {
    // TODO: handle npm versions
    if (importer == null) {
      return;
    }
    if (id.startsWith("http")) {
      return;
    }
    if (id.startsWith(".")) {
      return;
    }

    // handle importMap
    const importMap =
      opts.importmaps instanceof Function
        ? await opts.importmaps()
        : opts.importmaps ?? { imports: {} };
    const mapped = importMap && importMap?.imports[id];
    if (mapped) {
      return mapped;
    }

    // fallback to skypack
    const ret = `https://cdn.skypack.dev/${id}`;
    opts.onWarn?.(`[http-resolver]: fallback ${id} to ${ret}`);
    return ret;
  };
}
