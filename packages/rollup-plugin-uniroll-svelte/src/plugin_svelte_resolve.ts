import type { Plugin } from "rollup";

const svelteMarker = "svelte:";

const svelteTargetList = [
  "svelte",
  "svelte/internal",
  "svelte/store",
  "svelte/easing",
  "svelte/animate",
  "svelte/motion",
];

export const svelteResolverPlugin = () => {
  return {
    name: "svelte-resolve",
    enforce: "pre",
    resolveId(id: string, importer: string) {
      if (
        importer?.startsWith(svelteMarker) &&
        id.endsWith("internal/index.mjs")
      ) {
        return svelteMarker + "svelte/internal";
      }
      if (svelteTargetList.includes(id)) {
        return svelteMarker + id;
      }
    },
    async load(id: string) {
      if (id.startsWith(svelteMarker)) {
        const rawId = id.split(svelteMarker)[1];
        if (svelteTargetList.includes(rawId)) {
          switch (rawId) {
            case "svelte":
              return await import("svelte").then((t) => t.default);
            case "svelte/internal":
              return await import("svelte/internal").then((t) => t.default);
            case "svelte/store":
              return await import("svelte/store").then((t) => t.default);
            case "svelte/easing":
              return await import("svelte/easing").then((t) => t.default);
            case "svelte/animate":
              return await import("svelte/animate").then((t) => t.default);
            case "svelte/motion":
              return await import("svelte/motion").then((t) => t.default);
          }
        }
      }
    },
    // async transform(code: string, id: string) {
    // },
  } as Plugin;
};
