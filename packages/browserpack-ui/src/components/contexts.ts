import React, { useContext } from "react";
import { Env } from "../..";
export const EnvContext = React.createContext<Env>(null as any);
export function useEnv() {
  return useContext(EnvContext);
}