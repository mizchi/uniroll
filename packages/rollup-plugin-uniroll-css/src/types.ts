export type Options = {
  postprocess?: (css: string) => Promise<string>;
  /**
   * output css file instead of js injection.
   */
  output?: string;
};
