import { Plugin } from "rollup";
const PIKA_CDN_HOST = "https://cdn.pika.dev";

export function pikaCDNResolver({
  cache = new Map(),
  onRequest,
  onUseCache
}: {
  cache?: any;
  onRequest?: (url: string) => void;
  onUseCache: (url: string) => void;
}) {
  return {
    async resolveId(id: string, importer: string) {
      // console.log(id, importer);
      if (importer && importer.startsWith(PIKA_CDN_HOST)) {
        // load pika in pika
        if (id.startsWith(PIKA_CDN_HOST)) {
          return id;
        }
        const newId = PIKA_CDN_HOST + id;
        return newId;
      }
    },
    async load(id: string) {
      if (id.startsWith(PIKA_CDN_HOST)) {
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
    }
  } as Plugin;
}
