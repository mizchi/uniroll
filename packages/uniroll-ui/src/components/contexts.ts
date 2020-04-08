import React, { useContext } from "react";
import { Env, Files } from "../../index.d";

// env
export const EnvContext = React.createContext<Env>(null as any);
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
