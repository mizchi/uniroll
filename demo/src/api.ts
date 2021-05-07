import { wrap } from "comlink";
import type { WorkerApi } from "./uniroll";
import Worker from "./uniroll?worker";

const w = new Worker();
const api = wrap<WorkerApi>(w);
export { api };
