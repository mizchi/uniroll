import { Options } from "./types";
export async function transformCss(
  input: string,
  _options: Options
): Promise<string> {
  // Do nothing on debug
  return _options.postprocess ? _options.postprocess(input) : input;
}
