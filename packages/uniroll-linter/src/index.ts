import type { Linter as EslintLinter } from "eslint";
import Linter from "./Linter";

const linter = new Linter();

export function lint(
  code: string,
  filename?: string,
  config?: EslintLinter.Config
): EslintLinter.LintMessage[] {
  const messages = linter.verify(
    code,
    {
      parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module"
      },
      env: {
        es6: true,
        browser: true
      },
      globals: {
        global: true,
        globalThis: true,
        module: true,
        regeneratorRuntime: true,
        __defineSetter__: true,
        __defineGetter__: true
      },
      rules: {
        "no-undef": "error"
      },
      ...config
    },
    { filename }
  );
  return messages;
}
