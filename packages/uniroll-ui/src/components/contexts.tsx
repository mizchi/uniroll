import { EnvInput } from "../..";
import React, { useContext } from "react";
import { Env, Files } from "../..";
import { defaultLayout } from "..";

// env
const EnvContext = React.createContext<Env>(null as any);

export function UnirollEnvProvider(props: { value: EnvInput; children: any }) {
  const resolvedEnv = {
    layout: defaultLayout,
    inExtension: props.value.inExtension ?? false,
    templateHost:
      "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen",
    ...props.value,
  } as Env;
  return (
    <EnvContext.Provider value={resolvedEnv}>
      {props.children}
    </EnvContext.Provider>
  );
}

export function useEnv() {
  return useContext(EnvContext);
}

export const IsInMobileContext = React.createContext<boolean>(false);
export function useIsInMobile() {
  return useContext(IsInMobileContext);
}

export const AppStateContext = React.createContext<{
  scene: string;
  files: Files;
  currentFilepath: string | null;
  onSetFiles(files: Files): void;
  onUpdateFile(filepath: string, content: string): void;
  onSelectFilepath(filepath: string | null): void;
  onSelectScene: (nextScene: string) => void;
}>(null as any);

export function useAppState() {
  return useContext(AppStateContext);
}
