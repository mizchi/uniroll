export type CompileOptions = {
  entry: string;
  files: { [filepath: string]: string };
  pkg: { dependencies: any };
  tsConfig: any;
  minify?: boolean;
  typescript?: boolean;
  cache?: any;
};
