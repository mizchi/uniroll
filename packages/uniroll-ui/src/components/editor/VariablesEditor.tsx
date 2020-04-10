// TODO: Pluggable Source Editor

import type {
  Source,
  TypeAnnotation,
  LVal,
  RVal,
  VariableStatement,
} from "uniroll-types";
import React, { useCallback, useState } from "react";
import { DUMMY_REFERENCE_DEFS } from "./dummyData";
import { Flex, Button, Text, Input, Textarea, Select } from "@chakra-ui/core";

// ----------
// Constants

const SELECTABLE_SOURCES: Array<Source["type"]> = [
  "text-input",
  "template-input",
  "number-input",
  "checkbox",
  "json-input",
  "reference",
  "null",
];
// @ts-ignorea
const DEFAULT_RIGHT_OF_SOURCES: { [key: Source["type"]]: RVal } = {
  null: {
    typeAnnotation: {
      type: "null",
    },
    value: null,
  },
  "text-input": {
    typeAnnotation: {
      type: "string",
    },
    value: "",
  },
  "template-input": {
    typeAnnotation: {
      type: "string",
    },
    value: "",
  },
  "number-input": {
    typeAnnotation: {
      type: "number",
    },
    value: 0,
  },
  checkbox: {
    typeAnnotation: {
      type: "boolean",
    },
    value: false,
  },
  "json-input": {
    typeAnnotation: {
      type: "object",
    },
    value: {},
  },
  reference: {
    id: "$null",
    typeAnnotation: {
      type: "null",
    },
  },
};

const DEFAULT_SOURCE_BY_TYPE: { [key: string]: Source["type"] } = {
  null: "null",
  string: "text-input",
  number: "number-input",
  boolean: "checkbox",
  array: "json-input",
  object: "json-input",
};

// 型の一覧
const TYPES: Array<TypeAnnotation["type"]> = [
  "string",
  "number",
  "boolean",
  "null",
  "object",
  "array",
  "any",
];

export function toVariables(variables: VariableStatement[]) {
  return variables.reduce((acc, next) => {
    return { ...acc, [next.left.key]: next.right.value };
  }, {});
}

export function VariablesEditor(props: {
  assigns: VariableStatement[];
  onChange: (newValues: VariableStatement[]) => void;
}) {
  return (
    <VariablesEditorList
      key={props.assigns.length}
      values={props.assigns}
      onChange={props.onChange}
    />
  );
}

function VariablesEditorList(props: {
  values: VariableStatement[];
  onChange: (values: VariableStatement[]) => void;
}) {
  return (
    <Flex paddingLeft={10} direction="column">
      <Flex direction="column">
        {props.values.map((source, index) => {
          return (
            <KeyValuePairEditor
              key={index}
              index={index}
              assign={source}
              onDelete={(idx) => {
                console.log("delete idx", idx);
                const newList = props.values.filter((n, i) => {
                  return idx !== i;
                });
                props.onChange(newList);
              }}
              onChange={(changed) => {
                const newList = props.values.map((item, updatedIndex) => {
                  // TODO: same value updated
                  if (index === updatedIndex) {
                    return changed;
                  } else {
                    return item;
                  }
                });
                props.onChange(newList);
              }}
            />
          );
        })}
      </Flex>
      <Flex>
        <Button
          onClick={() => {
            const newSources = props.values.concat({
              left: {
                key: `value-${props.values.length + 1}`,
              },
              right: {
                resolverType: "literal",
                value: "",
                typeAnnotation: { type: "string" },
              },
            } as VariableStatement);
            props.onChange(newSources);
          }}
        >
          add
        </Button>
      </Flex>
    </Flex>
  );
}

function KeyValuePairEditor(props: {
  index: number;
  assign: VariableStatement;
  onChange: (changed: VariableStatement, index: number) => void;
  onDelete: (index: number) => any;
}) {
  return (
    <Flex paddingBottom={14}>
      <Flex
        style={{ paddingRight: 2 }}
        onClick={() => props.onDelete(props.index)}
      >
        <Text
          style={{
            padding: 1,
            background: "black",
            color: "red",
            borderRadius: 2,
          }}
        >
          X
        </Text>
      </Flex>
      <Flex>
        <KeyEditor
          left={props.assign.left}
          onChange={(newval) => {
            console.log("key editor update", newval);
            const newAssign = {
              ...props.assign,
              left: newval,
            } as VariableStatement;
            props.onChange(newAssign, props.index);
          }}
        />
      </Flex>
      <Flex>&nbsp;=&nbsp;</Flex>
      <Flex>
        <SourceSelector
          key={props.assign.left.typeAnnotation?.type}
          right={props.assign.right}
          onChange={(newval) => {
            const newAssign = {
              ...props.assign,
              right: newval,
            } as VariableStatement;
            props.onChange(newAssign, props.index);
          }}
        />
      </Flex>
    </Flex>
  );
}

// Key Editor
function KeyEditor(props: { left: LVal; onChange: (left: LVal) => void }) {
  return (
    <>
      <Input
        isDisabled={props.left.keyFixed}
        value={props.left.key}
        onChange={(ev: any) => {
          props.onChange({ ...props.left, key: ev.target.value as string });
        }}
      />
      {props.left.typeRequired && (
        <TypeDisplay type={props.left.typeAnnotation} />
      )}
    </>
  );
}

// Value Editor
function ValueEditor(props: {
  // right: right,
  value: RVal;
  type: Source["type"];
  onChange: (value: RVal) => any;
}) {
  switch (props.type) {
    case "null": {
      return <Text>null</Text>;
    }

    case "text-input": {
      return (
        <Input
          defaultValue={props.value.value as string}
          placeholder="input text..."
          onChange={(ev: any) => {
            props.onChange({
              typeAnnotation: { type: "string" },
              value: ev.target.value,
              resolverType: "literal",
            });
          }}
        />
      );
    }
    case "number-input": {
      return (
        <Input
          defaultValue={props.value.value as number}
          placeholder="input number..."
          type="number"
          onChange={(ev: any) => {
            props.onChange({
              typeAnnotation: { type: "number" },
              value: Number(ev.target.value),
              resolverType: "literal",
            });
          }}
        />
      );
    }
    case "checkbox": {
      return (
        <Input
          defaultValue={props.value.value as any}
          type="checkbox"
          onChange={(ev: any) => {
            props.onChange({
              typeAnnotation: { type: "boolean" },
              value: Boolean(ev.target.checked),
              resolverType: "literal",
            });
          }}
        />
      );
    }
    case "json-input": {
      return (
        <JSONEditor
          value={props.value.value as any}
          requiredType={{ type: "object" }}
          onChange={props.onChange}
        />
      );
    }
    case "template-input": {
      return (
        <Textarea
          value={props.value.value as string}
          onChange={(ev: any) => {
            props.onChange({
              typeAnnotation: { type: "string" },
              value: ev.target.value,
              resolverType: "literal",
            });
          }}
        />
      );
    }
    case "reference": {
      return (
        <ReferenceEditor
          right={props.value}
          onChange={(ref) => {
            props.onChange(ref);
          }}
        />
      );
    }
    default: {
      return <>unknown</>;
    }
  }
}

// JSON Editor
function JSONEditor(props: {
  value: object | Array<any>;
  requiredType: TypeAnnotation;
  onChange: (e: RVal) => any;
}) {
  let val;
  try {
    val = JSON.stringify(props.value);
  } catch (err) {
    val = "{}";
  }
  const [state, setState] = useState(val);
  const [parseable, setParseable] = useState(true);
  return (
    <>
      <Textarea
        value={state}
        style={{ background: parseable ? "transparent" : "red" }}
        onChange={(ev: any) => {
          setState(ev.target.value);
          try {
            const json = JSON.parse(ev.target.value);
            setParseable(true);
            console.log("parseable", json);
            props.onChange({
              typeAnnotation: props.requiredType,
              value: json,
              resolverType: "literal",
            });
          } catch (e) {
            setParseable(false);
          }
        }}
      />
    </>
  );
}

function ReferenceEditor(props: {
  right: RVal;
  onChange: (right: RVal) => void;
}) {
  const defs = DUMMY_REFERENCE_DEFS;
  return (
    <>
      <Select
        defaultValue={defs[0].id}
        onChange={(ev) => {
          const hit = defs.find((r) => r.id === ev.target.value);
          if (hit) {
            props.onChange({
              ...props.right,
              value: ev.target.value,
              resolverType: "reference",
              manualTypeAnnotation: hit.manualTypeAnnotation,
              typeAnnotation: hit.manualTypeAnnotation
                ? { type: "null" }
                : hit.typeAnnotation,
            });
          }
        }}
      >
        {defs.map((def) => {
          return (
            <option key={def.id} value={def.id}>
              {def.id}
            </option>
          );
        })}
      </Select>
      {props.right.resolverType === "reference" &&
        props.right.manualTypeAnnotation && (
          <TypeEditor
            type={props.right.typeAnnotation || { type: "null" }}
            onChange={(type) => {
              props.onChange({ ...props.right, typeAnnotation: type });
            }}
          />
        )}
    </>
  );
}

function SourceSelector(props: {
  right: RVal;
  onChange: (newval: RVal) => void;
}) {
  const sourceType =
    DEFAULT_SOURCE_BY_TYPE[props.right.typeAnnotation?.type || "string"];

  const [selectedSource, setSelecetedSource] = useState<Source["type"]>(
    sourceType
  );
  return (
    <>
      <Select
        value={selectedSource}
        onChange={(event) => {
          const nextType = event.target.value as Source["type"];
          // @ts-ignore
          const nextRight = DEFAULT_RIGHT_OF_SOURCES[nextType];
          props.onChange(nextRight);
          setSelecetedSource(nextType);
        }}
      >
        {SELECTABLE_SOURCES.map((source) => {
          return (
            <option key={source} value={source}>
              {source}
            </option>
          );
        })}
      </Select>
      <ValueEditor
        key={selectedSource}
        value={props.right}
        type={selectedSource}
        onChange={props.onChange}
      />
    </>
  );
}

function TypeDisplay(props: { type: TypeAnnotation }) {
  return <Text>{props.type.type}</Text>;
}

function TypeEditor(props: {
  type: TypeAnnotation;
  onChange: (newType: TypeAnnotation) => void;
}) {
  const onChange = useCallback(
    (ev: any) => {
      const newType: TypeAnnotation["type"] = ev.target.value;
      switch (newType) {
        case "array": {
          // TODO: Select items type
          const t = { type: "array", items: { type: "any" } } as TypeAnnotation;
          props.onChange(t);
          break;
        }

        case "object": {
          // TODO: Select properties
          const t = { type: "object" } as TypeAnnotation;
          props.onChange(t);
          break;
        }
        default: {
          const t = { type: newType } as TypeAnnotation;
          props.onChange(t);
          break;
        }
      }
    },
    [props.type.type]
  );

  return (
    <Select value={props.type.type} onChange={onChange}>
      {TYPES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </Select>
  );
}
