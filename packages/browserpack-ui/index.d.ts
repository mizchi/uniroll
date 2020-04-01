export type Files = {
  [key: string]: string;
};

export type State = {
  files: Files;
};

export type Env = {
  inExtension: boolean;
  compile(options: any): Promise<any>;
  save(state: State): Promise<void>;
  load(): Promise<State>;
};
export const App: React.ComponentClass;
export const EnvContext: React.Context<Env>;
export function useEnv(): Env;
