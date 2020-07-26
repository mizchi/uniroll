import { Plugin } from "rollup";
import path from "path";
const SKYPACK_CDN_HOST = "https://cdn.skypack.dev";

export function skypackCDNResolver({
  cache = new Map(),
  onRequest,
  onUseCache,
  ignorePolyfill = false,
}: {
  cache?: any;
  ignorePolyfill?: boolean;
  onRequest?: (url: string) => void;
  onUseCache?: (url: string) => void;
}) {
  return {
    async resolveId(id: string, importer: string) {
      // console.log(id, importer);
      if (importer && importer.startsWith(SKYPACK_CDN_HOST)) {
        // load Skypack in Skypack
        if (id.startsWith(SKYPACK_CDN_HOST)) {
          return id;
        }

        const { pathname, protocol, host } = new URL(importer);
        if (id.startsWith("/")) {
          return `${protocol}//${host}${id}`;
        } else {
          const resolvedPathname = path.join(path.dirname(pathname), id);
          const newId = `${protocol}//${host}${resolvedPathname}`;
          return newId;
        }
      }
    },
    async load(id: string) {
      if (id.includes("@pika/polyfill")) {
        return `// ignored: ${id}`;
      }
      if (id.startsWith(SKYPACK_CDN_HOST)) {
        const cached = await cache.get(id);
        if (cached) {
          onUseCache && onUseCache(id);
          return cached;
        }
        onRequest && onRequest(id);
        const res = await fetch(id);
        if (!res.ok) {
          throw res.statusText;
        }
        const code = await res.text();
        await cache.set(id, code);
        return code;
      }
    },
  } as Plugin;
}
