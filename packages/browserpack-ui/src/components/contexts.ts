import React, { useContext } from "react";
import { Env } from "../..";

// env
export const EnvContext = React.createContext<Env>(null as any);
export function useEnv() {
  return useContext(EnvContext);
}

export const IsInMobileContext = React.createContext<boolean>(false);
export function useIsInMobile() {
  return useContext(IsInMobileContext);
}
