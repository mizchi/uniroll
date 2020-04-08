import { Layout } from "../index.d";
import { RunnerPane } from "./components/panes/RunnerPane";
import { EditorPanel } from "./components/panes/EditorPanel";
import { VariablesPane } from "./components/panes/VariablesPane";
import { TemplatesPane } from "./components/panes/TemplatesPane";

export {
  EnvContext,
  useEnv,
  useAppState,
  useIsInMobile,
} from "./components/contexts";
export { App } from "./components/App";
export * from "./types";

export const defaultLayout: Layout = {
  leftTabs: [
    {
      displayName: "Run",
      id: "run",
      component: RunnerPane,
    },
    {
      displayName: "Files",
      id: "editor",
      component: EditorPanel,
    },
    {
      displayName: "variables",
      id: "variables",
      component: VariablesPane,
    },
  ],
  rightTabs: [
    {
      displayName: "Templates",
      id: "templates",
      component: TemplatesPane,
    },
  ],
};
