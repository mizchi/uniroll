import { optimize as optimizeCss } from "./css";
import { optimize as optimizeJs } from "./js";
export async function optimizeChunks(files: {
  [k: string]: string;
}): Promise<{ [k: string]: string }> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([fpath, value]) => {
        if (fpath.endsWith(".js")) {
          return [fpath, await optimizeJs(value)];
        }
        if (fpath.endsWith(".css")) {
          return [fpath, await optimizeCss(value)];
        }
        return [fpath, value];
      })
    )
  );
}
export { optimizeCss, optimizeJs };
