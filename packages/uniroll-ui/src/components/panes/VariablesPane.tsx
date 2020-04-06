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
import { Files } from "../App";
import { VariablesEditor } from "../editor/VariablesEditor";
import { AssignStatement } from "../editor/variables";

export function VariablesPane(props: {
  files: Files;
  onUpdate: (filepath: string, value: string) => void;
}) {
  const raw = props.files["/variables.json"];

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
        props.onUpdate("/variables.json", JSON.stringify(newAssigns, null, 2));
        const variables = newAssigns.reduce((acc, next) => {
          return { ...acc, [next.lval.key]: next.rval.value };
        }, {});
        // setCompiledValues(variables);
        console.log("compiled variables", variables);
      }}
    />
  );
}

// VariablesEditor
export function VariableDefsEditor(props: {
  // initialRequiredProps: RequiredProp[];
  initialAssigns: AssignStatement[];
  onChange: (defs: AssignStatement[]) => void;
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
