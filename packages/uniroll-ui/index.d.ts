import { VariableStatement } from "./../uniroll-types/variables.d";
import { TemplateDef } from "uniroll-types";

export const App: React.ComponentClass;
export const UnirollEnvProvider: React.ComponentClass<EnvInput>;
export const EnvContext: React.Context<Env>;
export function useEnv(): Env;

export type Files = {
  [key: string]: string;
};

export type State = {
  files: Files;
};

export type OptionalEnv = {
  templateHost?: string;
  resolveVariables?: (variables: VariableStatement[]) => Promise<any>;
  evalCodeInActiveTab?: (code: string, options: any) => void;
  downloadToLocal?: (dump: TemplateDef) => Promise<void>;
  loadFromLocal?: () => Promise<TemplateDef>;
  saveCurrentState?: (state: State) => Promise<void>;
  loadLastState?: () => Promise<State>;
};

export type EnvInput = {
  inExtension?: boolean;
  layout?: Layout;
  compile(options: any): Promise<any>;
} & OptionalEnv;

export type Env = OptionalEnv & {
  templateHost: string;
  inExtension: boolean;
  compile(options: any): Promise<any>;
  layout: Layout;
};

export type TabComponent = {
  id: string;
  displayName: string;
  component: React.ComponentType<{}>;
};

export type Layout = {
  leftTabs: TabComponent[];
  rightTabs: TabComponent[];
};
