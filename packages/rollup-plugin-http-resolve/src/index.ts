import { Plugin } from "rollup";
import path from "path";

export type ImportMaps = {
  imports: { [k: string]: string };
};

function isHttpProtocol(id: string | undefined | null) {
  return id?.startsWith("http://") || id?.startsWith("https://");
}

const DEBUG = false;
const log = (...args: any) => DEBUG && console.log(...args);

type HttpResolveOptions = {
  cache?: any;
  fetcher?: (url: string) => Promise<string>;
  onRequest?: (url: string) => void;
  onUseCache?: (url: string) => void;
  fallback?: (
    id: string,
    importer: string,
    warn: (warn: any) => void
  ) => Promise<string | void> | void | string;
};
const defaultCache = new Map();
export const httpResolve = function httpResolve_({
  cache = defaultCache,
  onRequest,
  onUseCache,
  fetcher,
  fallback,
}: HttpResolveOptions = {}) {
  return {
    name: "http-resolve",
    async resolveId(id: string, importer: string) {
      log("[http-resolve:resolveId:enter]", id, "from", importer);
      // on network resolve
      if (importer && isHttpProtocol(importer)) {
        if (id.startsWith("https://")) {
          log("[http-reslove:end] return with https", id);
          return id;
        }
        const { pathname, protocol, host } = new URL(importer);
        // for skypack
        if (id.startsWith("/")) {
          // pattern: /_/ in https://cdn.skypack.dev
          log(
            "[http-reslove:end] return with host root",
            `${protocol}//${host}${id}`
          );
          return `${protocol}//${host}${id}`;
        } else if (id.startsWith(".")) {
          // pattern: ./xxx/yyy in https://esm.sh
          const resolvedPathname = path.join(path.dirname(pathname), id);
          const newId = `${protocol}//${host}${resolvedPathname}`;
          log("[http-resolve:end] return with relativePath", newId);
          return newId;
        }
      } else if (fallback) {
        const fallbacked = await fallback(id, importer, this.warn);
        log("[http-resolve:end] use fallback to", id, "=>", fallbacked);
        if (fallbacked) {
          return fallbacked;
        }
      }
    },
    async load(id: string) {
      log("[http-resolve:load]", id);
      if (id === null) {
        return;
      }
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
};

export function createImportMapsFallback({
  importmaps,
}: {
  importmaps?: ImportMaps;
}) {
  return (
    id: string,
    importer: string | void = undefined,
    warn: (warning: any) => any
  ): Promise<void | string> | void | string => {
    if (importer == null) {
      return;
    }
    if (id.startsWith("http")) {
      return;
    }
    if (id.startsWith(".")) {
      return;
    }

    const mapped = importmaps?.imports[id];
    if (mapped) {
      return mapped;
    }
    warn(`missed fallback to https://cdn.skypack.dev/${id}`);
    return `https://cdn.skypack.dev/${id}`;
  };
}

// export default httpResolve;
