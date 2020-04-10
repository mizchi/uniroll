import React, { useState, useCallback } from "react";
import {
  Flex,
  Text,
  Textarea,
  Button,
  LightMode,
  Box,
  Select,
  Code,
  Divider,
} from "@chakra-ui/core";

import { VariablesEditor } from "../editor/VariablesEditor";
import { useAppState } from "../contexts";
import { VariableStatement } from "uniroll-types";

export function VariablesPane() {
  const { files, onUpdateFile } = useAppState();

  const raw = files["/variables.json"];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // invalid
  }

  if (!parsed || !(parsed instanceof Array)) {
    return <Text>Variables are invalid syntax. Fix it by files directly.</Text>;
  }
  return (
    <VariableDefsEditor
      initialAssigns={parsed}
      onChange={(newAssigns) => {
        console.log(newAssigns);
        onUpdateFile("/variables.json", JSON.stringify(newAssigns, null, 2));
        const variables = newAssigns.reduce((acc, next) => {
          return { ...acc, [next.left.key]: next.right.value };
        }, {});
        // setCompiledValues(variables);
        console.log("compiled variables", variables);
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
