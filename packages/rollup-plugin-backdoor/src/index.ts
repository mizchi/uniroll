import type { Plugin } from "rollup";

export const BACKDOOR_PREFIX = "backdoor:";
const BACKDOOR_KEY = "__rollup_plugin_backdoor";
// @ts-ignore
globalThis[BACKDOOR_KEY] = {};

let buildContextId: null | number = null;
export function backdoor(opts: { instances: { [k: string]: any } }) {
  return {
    name: "backdoor",
    buildStart() {
      if (buildContextId) {
        // @ts-ignore
        delete globalThis[BACKDOOR_KEY][buildContextId];
      }
      // renew
      buildContextId = Math.random();
      // @ts-ignore
      globalThis[BACKDOOR_KEY][buildContextId] = opts.instances;
    },
    resolveId(id) {
      if (id.startsWith(BACKDOOR_PREFIX)) {
        const rawId = id.replace(BACKDOOR_PREFIX, "");
        if (opts.instances[rawId]) {
          return id;
        }
      }
    },
    load(id: string) {
      if (id.startsWith(BACKDOOR_PREFIX)) {
        const rawId = id.replace(BACKDOOR_PREFIX, "");
        return `export default globalThis["${BACKDOOR_KEY}"]["${buildContextId}"]["${rawId}"]`;
      }
    },
  } as Plugin;
}
