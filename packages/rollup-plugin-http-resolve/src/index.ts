import { Plugin } from "rollup";
import path from "path";

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
  rewriter,
}: {
  cache?: any;
  fetcher?: (url: string) => Promise<string>;
  onRequest?: (url: string) => void;
  onUseCache?: (url: string) => void;
  rewriter?: (
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
      if (rewriter) {
        log("[http-reslove:end] use rewrite to", id);
        // @ts-ignore
        const rewriten = await rewriter(id, importer);
        if (rewriten) {
          console.log("rewrite", rewriten, "from", id);
          return rewriten;
        }
      }

      log("[http-reslove:end] no rewrite to", id);
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
