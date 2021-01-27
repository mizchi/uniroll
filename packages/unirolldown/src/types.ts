import type { VFile } from "vfile";
export type VFileExtended = VFile & {
  data: {
    cursor: any;
    toc: any;
    files: { [k: string]: string };
  };
};
