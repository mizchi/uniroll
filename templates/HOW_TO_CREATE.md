# How to create new templates

## Expected directory

```
templates/<template-name>/
  requiredProps.json # []
  files/
    index.tsx
    package.json # { "name": "<template-name>", "dependencies": {} }
```

## `requiredProps` Scheme

```js
// prettier-ignore
[
  {
    "key": "fixed-string", // key
    "keyFixed": true, // optional: false
    "typeRequired": true, // optional: false
    "deletable": false, // optional: true
    "typeAnnotation": { // optional
      // jsonschema https://json-schema.org/
      "type": "string"
    },
    "defaultValue": "John Doe"
  },
]
```
