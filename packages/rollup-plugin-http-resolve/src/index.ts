import { Plugin } from "rollup";
import path from "path";

function isHttpProtocol(id: string) {
  return id.startsWith("http://") || id.startsWith("https://");
}

export function httpResolve({
  cache = new Map(),
  onRequest,
  onUseCache,
  fetcher,
}: {
  cache?: any;
  fetcher?: (url: string) => Promise<string>;
  onRequest?: (url: string) => void;
  onUseCache?: (url: string) => void;
}) {
  return {
    async resolveId(id: string, importer: string) {
      if (importer && isHttpProtocol(importer)) {
        if (id.startsWith("https://")) {
          return id;
        }
        const { pathname, protocol, host } = new URL(importer);
        if (id.startsWith("/")) {
          return `${protocol}//${host}${id}`;
        } else {
          // relative path
          const resolvedPathname = path.join(path.dirname(pathname), id);
          const newId = `${protocol}//${host}${resolvedPathname}`;
          return newId;
        }
      }
    },
    async load(id: string) {
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