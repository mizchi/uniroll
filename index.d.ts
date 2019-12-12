import { CDNCache } from "rollup-plugin-cdn-resolver";
export declare type CompileOptions = {
    entry: string;
    files: {
        [filepath: string]: string;
    };
    minify?: boolean;
    cache?: CDNCache;
    rollupConfig?: any;
    replace?: any;
};
export declare function compile(options: CompileOptions): Promise<import("rollup").RollupOutput>;
export declare function compileToString(options: CompileOptions): Promise<string>;
