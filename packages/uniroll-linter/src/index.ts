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
        browser: true
      },
      globals: { module: true },
      rules: {
        "no-undef": "error"
      },
      ...config
    },
    { filename }
  );
  return messages;
}
