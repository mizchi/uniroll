import qs from "querystring";
import type { Plugin, TransformResult } from "rollup";
// import type { SFCAsyncStyleCompileOptions } from "@vue/compiler-sfc";

const cssInjectionMarker = "__UNIROLL_VUE_CSS__";
// const cssPreprocessLangRE = /\.(less|sass|scss|styl|stylus|postcss)$/;
// const cssModuleRE = /\.module\.(less|sass|scss|styl|stylus|postcss|css)$/;
// const isCSSRequest = (file: string) => file.endsWith(".css") || cssPreprocessLangRE.test(file);

export function unirollVue() {
  return {
    name: "uniroll-plugin-vue",
    async transform(code: string, id: string): Promise<TransformResult> {
      const isVueStyle = /\?vue&type=style/.test(id);
      if (isVueStyle) {
        // TODO: preprocessing other alt css lang
        // const preprocessLang = (id.match(cssPreprocessLangRE) || [])[1] as SFCAsyncStyleCompileOptions["preprocessLang"];
        // const query = parseVuePartRequest(id);
        const genCode =
          `let ${cssInjectionMarker} = document.createElement('style');` +
          `${cssInjectionMarker}.innerHTML = ${JSON.stringify(code)};` +
          `document.head.appendChild(${cssInjectionMarker});`;
        return {
          code: genCode,
          map: null, // TODO:
        };
      } else {
        return code;
      }
    },
  } as Plugin;
}

/**
 * borow from rollup-plugin-vue
 * https://github.com/vuejs/rollup-plugin-vue/blob/3222451614e8c5e4c1c3188bd6388285a25851ba/src/index.ts#L320-L372
 */

type Query =
  | {
      filename: string;
      vue: false;
    }
  | {
      filename: string;
      vue: true;
      type: "script";
      src?: true;
    }
  | {
      filename: string;
      vue: true;
      type: "template";
      id?: string;
      src?: true;
    }
  | {
      filename: string;
      vue: true;
      type: "style";
      index: number;
      id?: string;
      scoped?: boolean;
      module?: string | boolean;
      src?: true;
    }
  | {
      filename: string;
      vue: true;
      type: "custom";
      index: number;
      src?: true;
    };

function parseVuePartRequest(id: string): Query {
  const [filename, query] = id.split("?", 2);
  if (!query) {
    return { vue: false, filename };
  }

  const raw = qs.parse(query);
  if ("vue" in raw) {
    return {
      ...raw,
      filename,
      vue: true,
      index: Number(raw.index),
      src: "src" in raw,
      scoped: "scoped" in raw,
    } as any;
  }

  return { vue: false, filename };
}
