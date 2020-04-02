import { Options } from "./types";
export async function transformCss(
  input: string,
  options: Options
): Promise<string> {
  return options.postprocess ? options.postprocess(input) : input;
}
