import React from "react";
import { Pane } from "./elements";
import { useTreeState } from "../contexts/tree";
export function ElementPropsEditor() {
  const { selectedId, inv } = useTreeState();
  if (!selectedId) {
    return <>None</>;
  }
  const data = inv.dataMap[selectedId];
  return (
    <Pane>
      <pre style={{ padding: 0, margin: 0 }}>
        {JSON.stringify(data, null, 2)}
      </pre>{" "}
    </Pane>
  );
}
