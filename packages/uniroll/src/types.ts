export type ImportMap = {
  imports: { [k: string]: string };
};

export type Cache = {
  get(key: string): Promise<string>;
  set(key: string, content: string): Promise<void>;
  clear(): Promise<void>;
};
