import { Layout } from "../index.d";
import { RunnerPane } from "./components/panels/RunnerPanel";
import { EditorPanel } from "./components/panels/EditorPanel";
import { VariablesPane } from "./components/panels/VariablesEditorPanel";
import { TemplatesPane } from "./components/panels/TemplateLoaderPanel";

export {
  UnirollEnvProvider,
  useEnv,
  useAppState,
  useIsInMobile,
} from "./components/contexts";
export { App } from "./components/App";

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
