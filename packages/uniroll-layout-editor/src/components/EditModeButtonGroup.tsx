import React from "react";
import { Pane } from "./elements";
import { useTreeDispatch, useTreeState } from "../contexts/tree";
import { selectEditMode, TreeEditMode } from "../reducer";
const buttons = [
  {
    editMode: TreeEditMode.ELEMENT,
  },
  {
    editMode: TreeEditMode.LAYOUT,
  },
  {
    editMode: TreeEditMode.ALL,
  },
  {
    editMode: TreeEditMode.PREVIEW,
  },
  {
    editMode: TreeEditMode.OUTPUT,
  },
];
export function EditModeButtonGroup() {
  const { editMode } = useTreeState();
  const dispatch = useTreeDispatch();
  return (
    <Pane>
      {buttons.map((b) => {
        return (
          <button
            key={b.editMode}
            disabled={editMode === b.editMode}
            onClick={() => dispatch(selectEditMode(b.editMode))}
          >
            {TreeEditMode[b.editMode]}
          </button>
        );
      })}
    </Pane>
  );
}
