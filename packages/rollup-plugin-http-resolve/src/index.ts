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

type HttpResolveOptions = {
  cache?: any;
  fetcher?: (url: string) => Promise<string>;
  onRequest?: (url: string) => void;
  onUseCache?: (url: string) => void;
  fallback?: (
    id: string,
    importer: string
  ) => Promise<{ rewriten: string; warning: boolean } | void>;
};
const defaultCache = new Map();
export const httpResolve = function httpResolve_({
  cache = defaultCache,
  onRequest,
  onUseCache,
  fetcher,
  fallback,
}: HttpResolveOptions) {
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
          log("[http-resolve:end] return with relativePath", newId);
          return newId;
        }
      }
      if (fallback) {
        log("[http-resolve:end] use fallback to", id);
        const fallbacked = await fallback(id, importer);
        if (fallbacked && fallbacked.rewriten) {
          if (fallbacked.warning) {
            this.warn(
              `[http-resolve:fallback] ${id} => ${fallbacked.rewriten}`
            );
          }
          return fallbacked.rewriten;
        }
      }
    },
    async load(id: string) {
      log("[http-resolve:load]", id);
      if (id === null) {
        this.warn("irregular missing id");
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

export function createFallback({ importmaps }: { importmaps?: ImportMaps }) {
  return async (
    id: string,
    importer: string | void = undefined
  ): Promise<void | { rewriten: string; warning: boolean }> => {
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
      return { rewriten: mapped, warning: false };
    }

    return { rewriten: `https://cdn.skypack.dev/${id}`, warning: true };
  };
}

// export default httpResolve;
