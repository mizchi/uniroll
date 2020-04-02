import {
  RequiredProp,
  Source,
  TypeAnnotation,
  RVal,
  LVal,
  AssignStatement
} from "./variables";
// import mustache from "mustache";
import React, { useCallback, useState } from "react";
import { DUMMY_REFERENCE_DEFS, DUMMY_TEMPLATES } from "./dummyData";

// ----------
// Constants

const SELECTABLE_SOURCES: Array<Source["type"]> = [
  "text-input",
  "template-input",
  "number-input",
  "checkbox",
  "json-input",
  "reference",
  "null"
];

// @ts-ignore
const DEFAULT_RVALUE_OF_SOURCES: { [key: Source["type"]]: RVal } = {
  null: {
    typeAnnotation: {
      type: "null"
    },
    value: null
  },
  "text-input": {
    typeAnnotation: {
      type: "string"
    },
    value: ""
  },
  "template-input": {
    typeAnnotation: {
      type: "string"
    },
    value: ""
  },
  "number-input": {
    typeAnnotation: {
      type: "number"
    },
    value: 0
  },
  checkbox: {
    typeAnnotation: {
      type: "boolean"
    },
    value: false
  },
  "json-input": {
    typeAnnotation: {
      type: "object"
    },
    value: {}
  },
  reference: {
    id: "$null",
    typeAnnotation: {
      type: "null"
    }
  }
};

const DEFAULT_SOURCE_BY_TYPE: { [key: string]: Source["type"] } = {
  null: "null",
  string: "text-input",
  number: "number-input",
  boolean: "checkbox",
  array: "json-input",
  object: "json-input"
};

// 型の一覧
const TYPES: Array<TypeAnnotation["type"]> = [
  "string",
  "number",
  "boolean",
  "null",
  "object",
  "array",
  "any"
];

// 型ごとの初期値
const INITIAL_VALUE_BY_TYPE: { [k: string]: any } = {
  string: "",
  number: 0,
  boolean: false,
  null: null,
  object: {},
  array: [],
  any: null,
  reference: "$null"
};

// ------------
// ユーティリティ

// テンプレートで宣言された型から初期値を作る関数
function buildDefaultAssigns(requiredProps: RequiredProp[]): AssignStatement[] {
  return requiredProps.map(s => {
    return {
      lval: {
        key: s.key,
        typeRequired: s.typeRequired,
        keyFixed: s.keyFixed,
        typeAnnotation: s.typeAnnotation
      },
      rval: {
        value:
          s.defaultValue ??
          INITIAL_VALUE_BY_TYPE[s.typeAnnotation?.type || "string"],
        typeAnnotation: s.typeAnnotation
      }
    } as AssignStatement;
  });
}

// 最終的なプレビュー用オブジェクトにたたむ関数(実際にはサーバーサイドで行われる)
function toVariables(variables: AssignStatement[]) {
  return variables.reduce((acc, next) => {
    return { ...acc, [next.lval.key]: next.rval.value };
  }, {});
}

// これがメイン
function VariablesEditor(props: {
  // TemplateDef の requiredProps を buildDefaultAssigns() で変換した代入一覧を取得
  assigns: AssignStatement[];
  onChange: (newValues: AssignStatement[]) => void;
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
  values: AssignStatement[];
  onChange: (values: AssignStatement[]) => void;
}) {
  return (
    <div style={{ paddingLeft: 10 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {props.values.map((source, index) => {
          return (
            <KeyValuePairEditor
              key={index}
              index={index}
              assign={source}
              onDelete={idx => {
                console.log("delete idx", idx);
                const newList = props.values.filter((n, i) => {
                  return idx !== i;
                });
                props.onChange(newList);
              }}
              onChange={changed => {
                const newList = props.values.map(item => {
                  if (item.lval.key === source.lval.key) {
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
      </div>
      {/* 変数追加ボタン */}
      <div>
        <button
          onClick={() => {
            const newSources = props.values.concat({
              lval: {
                key: `value-${props.values.length + 1}`
              },
              rval: {
                type: "literal",
                value: "",
                typeAnnotation: { type: "string" }
              }
            } as AssignStatement);
            props.onChange(newSources);
          }}
        >
          add
        </button>
      </div>
    </div>
  );
}

function KeyValuePairEditor(props: {
  index: number;
  assign: AssignStatement;
  onChange: (changed: AssignStatement) => void;
  onDelete: (index: number) => any;
}) {
  return (
    <div style={{ display: "flex", paddingBottom: 14 }}>
      <div
        style={{ paddingRight: 2 }}
        onClick={() => props.onDelete(props.index)}
      >
        <span
          style={{
            padding: 1,
            background: "black",
            color: "red",
            borderRadius: 2
          }}
        >
          X
        </span>
      </div>
      <div>
        <KeyEditor
          lval={props.assign.lval}
          onChange={newval => {
            console.log("key editor update", newval);
            const newAssign = {
              ...props.assign,
              lval: newval
            } as AssignStatement;
            props.onChange(newAssign);
          }}
        />
      </div>
      <div>&nbsp;=&nbsp;</div>
      <div>
        <SourceSelector
          key={props.assign.lval.typeAnnotation.type}
          rvalue={props.assign.rval}
          onChange={newval => {
            const newAssign = {
              ...props.assign,
              rval: newval
            } as AssignStatement;
            // debugger;
            props.onChange(newAssign);
          }}
        />
      </div>
    </div>
  );
}

// Key Editor
function KeyEditor(props: { lval: LVal; onChange: (lval: LVal) => void }) {
  return (
    <>
      <input
        disabled={props.lval.keyFixed}
        value={props.lval.key}
        onChange={ev => {
          props.onChange({ ...props.lval, key: ev.target.value });
        }}
      />
      {props.lval.typeRequired && (
        <TypeDisplay type={props.lval.typeAnnotation} />
      )}
    </>
  );
}

// Value Editor
function ValueEditor(props: {
  // rval: RVal,
  value: RVal;
  type: Source["type"];
  onChange: (value: RVal) => any;
}) {
  switch (props.type) {
    case "null": {
      return <span>null</span>;
    }

    case "text-input": {
      return (
        <input
          defaultValue={props.value.value as string}
          placeholder="input text..."
          onChange={ev => {
            props.onChange({
              typeAnnotation: { type: "string" },
              value: ev.target.value,
              type: "literal"
            });
          }}
        />
      );
    }
    case "number-input": {
      return (
        <input
          defaultValue={props.value.value as number}
          placeholder="input number..."
          type="number"
          onChange={ev => {
            props.onChange({
              typeAnnotation: { type: "number" },
              value: Number(ev.target.value),
              type: "literal"
            });
          }}
        ></input>
      );
    }
    case "checkbox": {
      return (
        <input
          defaultValue={props.value.value as any}
          type="checkbox"
          onChange={ev => {
            props.onChange({
              typeAnnotation: { type: "boolean" },
              value: Boolean(ev.target.checked),
              type: "literal"
            });
          }}
        ></input>
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
        <textarea
          value={props.value.value as string}
          onChange={ev => {
            props.onChange({
              typeAnnotation: { type: "string" },
              value: ev.target.value,
              type: "literal"
            });
          }}
        />
      );
    }
    case "reference": {
      return (
        <ReferenceEditor
          rvalue={props.value}
          onChange={ref => {
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
      <textarea
        value={state}
        style={{ background: parseable ? "transparent" : "red" }}
        onChange={ev => {
          setState(ev.target.value);
          try {
            const json = JSON.parse(ev.target.value);
            setParseable(true);
            console.log("parseable", json);
            props.onChange({
              typeAnnotation: props.requiredType,
              value: json,
              type: "literal"
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
  rvalue: RVal;
  onChange: (rval: RVal) => void;
}) {
  const defs = DUMMY_REFERENCE_DEFS;
  return (
    <>
      <select
        defaultValue={defs[0].id}
        onChange={ev => {
          const hit = defs.find(r => r.id === ev.target.value);
          if (hit) {
            props.onChange({
              ...props.rvalue,
              value: ev.target.value,
              type: "reference",
              manualTypeAnnotation: hit.manualTypeAnnotation,
              typeAnnotation: hit.manualTypeAnnotation
                ? { type: "null" }
                : hit.typeAnnotation
            });
          }
        }}
      >
        {defs.map(def => {
          return (
            <option key={def.id} value={def.id}>
              {def.id}
            </option>
          );
        })}
      </select>
      {props.rvalue.type === "reference" && props.rvalue.manualTypeAnnotation && (
        <TypeEditor
          type={props.rvalue.typeAnnotation ?? { type: "null" }}
          onChange={type => {
            props.onChange({ ...props.rvalue, typeAnnotation: type });
          }}
        />
      )}
    </>
  );
}

function SourceSelector(props: {
  rvalue: RVal;
  onChange: (newval: RVal) => void;
}) {
  const sourceType =
    DEFAULT_SOURCE_BY_TYPE[props.rvalue.typeAnnotation?.type || "string"];

  const [selectedSource, setSelecetedSource] = useState<Source["type"]>(
    sourceType
  );
  return (
    <>
      <select
        value={selectedSource}
        onChange={event => {
          const nextType = event.target.value as Source["type"];
          // @ts-ignore
          const nextRvalue = DEFAULT_RVALUE_OF_SOURCES[nextType];
          props.onChange(nextRvalue);
          setSelecetedSource(nextType);
        }}
      >
        {SELECTABLE_SOURCES.map(source => {
          return (
            <option key={source} value={source}>
              {source}
            </option>
          );
        })}
      </select>
      <ValueEditor
        key={selectedSource}
        value={props.rvalue}
        type={selectedSource}
        onChange={props.onChange}
      />
    </>
  );
}

function TypeDisplay(props: { type: TypeAnnotation }) {
  return <span>{props.type.type}</span>;
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
    <select value={props.type.type} onChange={onChange}>
      {TYPES.map(t => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}

// VariablesEditor
export function VariableMainEditor() {
  const templates = DUMMY_TEMPLATES;
  const [usingTemplateObject, setTemplateObject] = useState(templates[0]);
  const initialValues = buildDefaultAssigns(usingTemplateObject.requiredProps);
  const [editingValues, setEditingValues] = useState(initialValues);
  const [compiledValues, setCompiledValues] = useState<any>(
    toVariables(initialValues)
  );
  const [template, setTemplate] = useState("Hello, {{s}}");
  let rendered: string | null = null;
  try {
    return template;
    // rendered = mustache.render(template, compiledValues);
  } catch (err) {}
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ paddingLeft: 20 }}>
        <h2>variable editor</h2>
        <select
          value={usingTemplateObject.id}
          onChange={ev => {
            const template = DUMMY_TEMPLATES.find(
              t => t.id === ev.target.value
            );
            if (template) {
              setTemplateObject(template);
              const vs = buildDefaultAssigns(template.requiredProps);
              setEditingValues(vs);
              setCompiledValues(toVariables(vs));
            }
          }}
        >
          {templates.map(t => {
            return <option key={t.id}>{t.id}</option>;
          })}
        </select>

        <hr />
        <VariablesEditor
          assigns={editingValues}
          onChange={newValues => {
            setEditingValues(newValues);
            // console.log(newValues);
            const variables = newValues.reduce((acc, next) => {
              return { ...acc, [next.lval.key]: next.rval.value };
            }, {});
            setCompiledValues(variables);
          }}
        />
        <pre>
          <code>{JSON.stringify(compiledValues, null, 2)}</code>
        </pre>
        <hr />

        <div>
          <div style={{ height: "32px" }}>
            <select defaultValue="mustache">
              {["mustache"].map(key => {
                return <option key={key}>{key}</option>;
              })}
            </select>
          </div>
          <textarea
            value={template}
            style={{ height: "250px", width: "80%" }}
            onChange={ev => setTemplate(ev.target.value)}
          />
        </div>

        <div>
          {rendered && (
            <div
              dangerouslySetInnerHTML={{
                __html: rendered
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
