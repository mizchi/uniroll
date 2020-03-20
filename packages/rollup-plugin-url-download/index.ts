import type { Plugin } from "rollup";
const PIKA_CDN_HOST = "https://cdn.pika.dev";

export function urlDownloadPlugin() {
  return {
    async resolveId(id: string, importer: string) {
      if (importer && importer.startsWith(PIKA_CDN_HOST)) {
        const newId = PIKA_CDN_HOST + id;
        return newId;
      }
    },
    async load(id: string) {
      if (id.startsWith(PIKA_CDN_HOST)) {
        const res = await fetch(id);
        if (!res.ok) {
          throw res.statusText;
        }
        const code = await res.text();
        return code;
      }
    }
  } as Plugin;
}

// babel plugin
// function rewriteImportPathToCdn(id: string) {
//   return {
//     visitor: {
//       CallExpression(path: any) {
//         // @ts-ignore
//         if (path.node.callee.name === "require") {
//           // @ts-ignore
//           const target = path.node.arguments[0].value;
//           if (target.startsWith(".")) {
//             const resolved = url.resolve(id, target);
//             // @ts-ignore
//             path.node.arguments[0].value = addJsExt(resolved);
//           }
//         }
//       }
//     }
//   };
// }

// babel plugin
// export function rewriteImportPathToCdn(id: string) {
//   return {
//     visitor: {
//       CallExpression(path) {
//         // @ts-ignore
//         if (path.node.callee.name === "require") {
//           // @ts-ignore
//           const target = path.node.arguments[0].value;
//           if (target.startsWith(".")) {
//             const resolved = url.resolve(id, target);
//             // @ts-ignore
//             path.node.arguments[0].value = addJsExt(resolved);
//           }
//         }
//       }
//     }
//   };
// }

// async function doLoad(id: string) {
//   const res = await fetch(id);
//   const code = await res.text();
//   if (code.startsWith("Couldn't find the requested")) {
//     throw new Error("missing");
//   }
//   return code;
// }

// // File loader with cache
// async function load(id: string) {
//   try {
//     return await doLoad(id);
//   } catch (err) {}

//   const indexWithDir = id.replace(/.js$/, "/index.js");
//   if (DEBUG) console.log("fallback /index.js", indexWithDir);
//   try {
//     return await doLoad(indexWithDir);
//   } catch (err) {}

//   const maybePkgPath = id.replace(/.js$/, "/package.json");
//   if (DEBUG) console.log("fallback to pkg.main", maybePkgPath);

//   const pkgText = await doLoad(maybePkgPath);
//   const pkg = JSON.parse(pkgText);
//   if (pkg.main) {
//     const newMain = id.replace(/.js$/, "/" + pkg.main);
//     return await doLoad(newMain);
//   }

//   throw new Error("fail to load");
// }

// function addJsExt(p: string) {
//   if (p.endsWith(".mjs")) {
//     return p;
//   }
//   return p.endsWith(".js") ? p : p + ".js";
// }

// // Package resolver with cache
// const __pkgResolveCache: { [key: string]: any } = {};
// async function resolveUrl(
//   id: string,
//   _importer: string,
//   host: string,
//   pkg: { dependencies: { [key: string]: string } }
// ) {
//   const cacheKey = hash(pkg);
//   const resolvedPkg = __pkgResolveCache[cacheKey];

//   const [pkgName, ...pkgPaths] = id.split("/");
//   const resPkgName = Object.keys(resolvedPkg.resDependencies).find(
//     n => n.split("@")[0] === pkgName
//   );
//   if (resPkgName) {
//     const [name, version] = resPkgName.split("@");
//     const pkgPath =
//       pkgPaths.join("/") ||
//       resolvedPkg.resDependencies[resPkgName].module ||
//       resolvedPkg.resDependencies[resPkgName].main ||
//       "index.js";
//     const cdnPath = `${host}/${name}@${version}/${pkgPath}`;
//     return addJsExt(cdnPath);
//   }

//   if (resolvedPkg.appDependencies[pkgName]) {
//     const pkg = resolvedPkg.appDependencies[pkgName];
//     const version = pkg.version;
//     const pkgPath = pkgPaths.join("/") || pkg.module || pkg.main || "index.js";
//     const cdnPath = `${host}/${pkgName}@${version}/${pkgPath}`;
//     return addJsExt(cdnPath);
//   }

//   if (id.startsWith(host)) {
//     return id;
//   }
// }

// // TODO: Resolve relative files
// export async function getTypings(pkg: any) {
//   const cacheKey = hash(pkg);
//   let resolvedPkg = __pkgResolveCache[cacheKey];

//   if (resolvedPkg == null) {
//     __pkgResolveCache[cacheKey] = await resolvePkgsVersions(pkg);
//     resolvedPkg = __pkgResolveCache[cacheKey];
//   }

//   const ret = {};
//   await Promise.all(
//     Object.entries(resolvedPkg.appDependencies).map(
//       async ([name, pkg]: any) => {
//         if (pkg.types == null) {
//           return;
//         }
//         const host = "https://cdn.jsdelivr.net/npm";
//         const cdnPath = `${host}/${name}@${pkg.version}/${pkg.types}`;
//         const res = await fetch(cdnPath);
//         const dtsText = await res.text();
//         ret[name] = {
//           path: cdnPath,
//           code: dtsText
//         };
//       }
//     )
//   );
//   return ret;
// }
