import React, { useContext } from "react";
import { EditableView } from "./EditableView";
import { EditModeButtonGroup } from "./EditModeButtonGroup";
import { ElementPropsEditor } from "./ElementPropsEditor";
import { Flex, Pane } from "./elements";
import { SourceList } from "./SourceList";
import { View } from "./View";
import { PropsContext } from "../contexts/props";
import { TreeStateProvider, useTreeState } from "../contexts/tree";
import { TreeEditMode } from "../reducer";
import { Props } from "../types";

function SelectedModeTree() {
  const { tree, editMode } = useTreeState();
  switch (editMode) {
    case TreeEditMode.ALL:
    case TreeEditMode.ELEMENT:
    case TreeEditMode.LAYOUT: {
      return (
        <Flex flex={1}>
          <EditableView tree={tree} depth={0} />
        </Flex>
      );
    }
    case TreeEditMode.PREVIEW: {
      return (
        <Flex flex={1}>
          <View tree={tree} />
        </Flex>
      );
    }
    case TreeEditMode.OUTPUT: {
      return (
        <Flex flex={1}>
          <Pane height="80vh" overflow="auto">
            <pre>{JSON.stringify(tree, null, 2)}</pre>
          </Pane>
        </Flex>
      );
    }
  }
}

function AppInner() {
  return (
    <Flex flexDirection="column">
      <Flex display="flex" flex={1}>
        <Flex>
          <Pane width={300}>
            <SourceList />
          </Pane>
          <Pane flex={1} padding={10}>
            <Flex flexDirection="column">
              <Flex height={32}>
                <EditModeButtonGroup />
              </Flex>
              <Flex height="calc(100% - 32px)">
                <SelectedModeTree />
              </Flex>
            </Flex>
          </Pane>
        </Flex>
        <Pane width={300}>
          <ElementPropsEditor />
        </Pane>
      </Flex>
    </Flex>
  );
}

function AppImpl() {
  const props = useContext(PropsContext);
  return (
    <>
      <TreeStateProvider
        onChange={props.onChange}
        initialTree={props.initialTree}
      >
        <AppInner />
      </TreeStateProvider>
    </>
  );
}

export function App(props: Props) {
  return (
    <PropsContext.Provider value={props}>
      <AppImpl />
    </PropsContext.Provider>
  );
}
