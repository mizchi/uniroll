import { expose } from "comlink";

const api = {
  async foo() {
    return 1;
  },
};

expose(api);

export type WorkerApi = typeof api;
