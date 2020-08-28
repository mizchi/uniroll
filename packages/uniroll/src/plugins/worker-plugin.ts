// Drop amd
/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { PluginImpl } from "rollup";
import MagicString from "magic-string";

type Options = {
  workerRegexp?: RegExp;
  urlLoaderScheme?: "omt";
  inlineWorker?: boolean;
  inlineImportScripts?: boolean;
};
const defaultOpts = {
  workerRegexp: /new Worker\((["'])(.+?)\1(,[^)]+)?\)/g,
  urlLoaderScheme: "omt",
};

const plugin: PluginImpl<Options> = function (opts: Options = {}) {
  const optsWithDefault: typeof defaultOpts = Object.assign(
    {},
    defaultOpts,
    opts
  );
  const urlLoaderPrefix = optsWithDefault.urlLoaderScheme + ":";
  let workerFiles;
  return {
    name: "worker",

    async buildStart() {
      workerFiles = [];
    },

    async resolveId(id, importer) {
      if (!id.startsWith(urlLoaderPrefix)) return;
      const path = id.slice(urlLoaderPrefix.length);
      const newId = (await this.resolve(path, importer))?.id;
      if (!newId) throw Error(`Cannot find module '${path}'`);
      return urlLoaderPrefix + newId;
    },

    load(id) {
      if (!id.startsWith(urlLoaderPrefix)) return;
      const realId = id.slice(urlLoaderPrefix.length);
      const chunkRef = this.emitFile({ id: realId, type: "chunk" });
      return `export default import.meta.ROLLUP_FILE_URL_${chunkRef};`;
    },

    async transform(code, id) {
      // Copy the regexp as they are stateful and this hook is async.
      const workerRegexp = new RegExp(
        optsWithDefault.workerRegexp.source,
        optsWithDefault.workerRegexp.flags
      );
      if (!workerRegexp.test(code)) {
        return;
      }

      const ms = new MagicString(code);
      // Reset the regexp
      workerRegexp.lastIndex = 0;
      while (true) {
        const match = workerRegexp.exec(code);
        if (!match) {
          break;
        }

        const workerFile = match[2];
        let optionsObject = {};
        // Parse the optional options object
        if (match[3] && match[3].length > 0) {
          // FIXME: ooooof!
          optionsObject = new Function(`return ${match[3].slice(1)};`)();
        }
        if (!new RegExp("^.*/").test(workerFile)) {
          this.warn(
            `Paths passed to the Worker constructor must be relative or absolute, i.e. start with /, ./ or ../ (just like dynamic import!). Ignoring "${workerFile}".`
          );
          continue;
        }

        const resolvedWorkerFile = (await this.resolve(workerFile, id))?.id;
        if (!resolvedWorkerFile) {
          throw Error(`Cannot find module '${workerFile}'`);
        }
        workerFiles.push(resolvedWorkerFile);
        const chunkRefId = this.emitFile({
          id: resolvedWorkerFile,
          type: "chunk",
        });
        const workerParametersStartIndex = match.index + "new Worker(".length;
        const workerParametersEndIndex =
          match.index + match[0].length - ")".length;

        ms.overwrite(
          workerParametersStartIndex,
          workerParametersEndIndex,
          `import.meta.ROLLUP_FILE_URL_${chunkRefId}, ${JSON.stringify(
            optionsObject
          )}`
        );
      }

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }),
      };
    },

    resolveFileUrl(chunk) {
      return `"./${chunk.fileName}"`;
    },
  };
};

export default plugin;
