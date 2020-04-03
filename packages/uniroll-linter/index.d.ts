import type { Linter } from "eslint";
export function lint(
  code: string,
  options?: Linter.LintOptions
): Linter.LintMessage[];
