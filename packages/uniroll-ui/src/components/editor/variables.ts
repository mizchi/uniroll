export type TemplateDef = {
  id: string;
  requiredProps: RequiredProp[];
  initialFiles?: { [filename: string]: string };
};

export type RequiredProp = {
  key: string;
  deletable?: false;
  keyFixed?: boolean;
  typeRequired?: boolean;
  typeAnnotation?: TypeAnnotation;
  defaultValue?: any;
};

// VariableDef
export type TextInputSource = { type: "text-input"; value: string };
export type NumberInputSource = { type: "number-input"; value: number };
export type CheckboxSource = { type: "checkbox"; value: boolean };

// あんまり使いたくないが脱出ハッチとしては必要な気がする
export type JSONInputSource = {
  type: "json-input";
  value: object | Array<any>;
};

export type NullSource = { type: "null"; value: null };

export type TemplateInputSource = {
  type: "template-input";
  value: string;
};

export type ReferenceSource = {
  type: "reference";
  value: Reference;
  typeAnnotation?: any;
};

// export type ReferenceDef = {id: string, type}
export type ReferenceDef =
  | {
      id: string;
      typeAnnotation: TypeAnnotation;
      manualTypeAnnotation: false;
    }
  | {
      id: string;
      defaultTypeAnnotation?: TypeAnnotation;
      manualTypeAnnotation: true;
    };

export type Reference = string;

export type Source =
  | TextInputSource
  | NumberInputSource
  | CheckboxSource
  | JSONInputSource
  | TemplateInputSource
  | ReferenceSource
  | NullSource;

export type SourcePair = {
  key: string;
  def: Source;
};

export type SourceDef = Array<SourcePair>;

// Value
export type Value = RawValue | LazyGetValue;

export type RawValue = {
  type: "raw";
  scheme?: TypeAnnotation;
  value: any;
};

// UI上で遅延解決する必要がある場合に備えているが、考えすぎかも
export type LazyGetValue = {
  type: "lazy-get";
  scheme?: TypeAnnotation;
  url: string;
};

export type Variables = {
  [key: string]: any; // RawValue.value
};

export type LazyVariables = {
  [key: string]: LazyGetValue;
};

// Scheme

export type TypeAnnotation =
  | ArrayType
  | ObjectType
  | AnyType
  | NullType
  | StringType
  | BooleanType
  | NumberType;

export type ArrayType = {
  type: "array";
  items?: TypeAnnotation;
};

export type AnyType = {
  type: "any";
};

export type ObjectType = {
  type: "object";
  required?: string[];
  properties?: {
    [key: string]: TypeAnnotation;
  };
};
export type NullType = {
  type: "null";
};

export type StringType = {
  type: "string";
};
export type BooleanType = {
  type: "boolean";
};
export type NumberType = {
  type: "number";
};

export type Literal = string | number | boolean | object | Array<any>;

export type LVal = {
  key: string;
  typeAnnotation: TypeAnnotation;
  keyFixed?: boolean;
  typeRequired?: boolean;
};

export type RVal =
  | {
      type: "literal";
      value: Literal; // LVal.typeAnnotation によってバリデーションされる
      typeAnnotation?: TypeAnnotation; // 自己申告
    }
  | {
      type: "reference";
      value: Reference; // LVal.typeAnnotation によってバリデーションされる
      typeAnnotation?: TypeAnnotation; // 自己申告
      manualTypeAnnotation?: boolean;
    };

export type AssignStatement = {
  lval: LVal;
  rval: RVal;
};

// variables.json として期待される型
export type VariablesJsonType = AssignStatement[];