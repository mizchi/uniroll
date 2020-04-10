import { Flex, Text } from "@chakra-ui/core";
import React, { useState } from "react";
import { VariableStatement } from "uniroll-types";
import { useAppState } from "../contexts";
import { VariablesEditor } from "../editor/VariablesEditor";

export function VariablesPane() {
  const { files, onUpdateFile } = useAppState();

  const raw = files["/variables.json"];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {}

  if (!parsed || !(parsed instanceof Array)) {
    return <Text>Variables are invalid syntax. Fix it by files directly.</Text>;
  }
  return (
    <VariableDefsEditor
      initialAssigns={parsed}
      onChange={(newAssigns) => {
        onUpdateFile("/variables.json", JSON.stringify(newAssigns, null, 2));
      }}
    />
  );
}

// VariablesEditor
export function VariableDefsEditor(props: {
  initialAssigns: VariableStatement[];
  onChange: (defs: VariableStatement[]) => void;
}) {
  const [editingValues, setEditingValues] = useState(props.initialAssigns);
  return (
    <Flex p={10} direction="column">
      <VariablesEditor
        assigns={editingValues}
        onChange={(newDefs) => {
          setEditingValues(newDefs);
          props.onChange(newDefs);
        }}
      />
    </Flex>
  );
}
