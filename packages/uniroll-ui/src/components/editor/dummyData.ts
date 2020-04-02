import { ReferenceDef, TemplateDef } from "./variables";

export const DUMMY_REFERENCE_DEFS: ReferenceDef[] = [
  {
    id: "$null",
    typeAnnotation: {
      type: "null"
    },
    manualTypeAnnotation: false
  },
  {
    id: "manual",
    manualTypeAnnotation: true
  }
];

export const simpleTemplate: TemplateDef = {
  id: "simple",
  requiredProps: [
    {
      key: "name",
      typeAnnotation: {
        type: "string"
      },
      defaultValue: "John Doe"
    }
  ]
};

export const complexTemplate: TemplateDef = {
  id: "complex",
  requiredProps: [
    {
      key: "fixed-string",
      keyFixed: true,
      typeRequired: true,
      deletable: false,
      typeAnnotation: {
        type: "string"
      },
      defaultValue: "John Doe"
    },
    {
      key: "b",
      typeAnnotation: {
        type: "boolean"
      }
    },
    {
      key: "n",
      typeAnnotation: {
        type: "number"
      },
      defaultValue: 10
    },
    {
      key: "N",
      typeAnnotation: {
        type: "null"
      }
    },
    {
      key: "obj",
      typeAnnotation: {
        type: "object"
      }
    },
    {
      key: "arr",
      typeAnnotation: {
        type: "array"
      }
    }
  ]
};

export const DUMMY_TEMPLATES = [complexTemplate, simpleTemplate];
