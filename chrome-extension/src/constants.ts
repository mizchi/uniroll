export const templateList = [
  {
    id: "simple",
    name: "simple",
    files: {
      "/index.tsx": `import "./style.css";
export default (props) => console.log("hello", props);
`,
      "/style.css": "span { color: red; };",
      "/variables.json": '{ "name": "foo" }'
    }
  },
  {
    id: "modal",
    name: "modal",
    files: {
      "/index.tsx": `export default (options: any) => {
  createModalElement("hello", options.variables);
};
export function createModalElement(text: string, variables: any) {
  const el = document.createElement("div");
  el.style.position = "absolute";

  el.style.right = "10px";
  el.style.bottom = "10px";
  el.style.width = "200px";
  el.style.height = "100px";
  el.style.backgroundColor = "wheat";
  el.textContent = text
  document.body.appendChild(el);
  return el;
}
`,
      "/variables.json": '{ "name": "foo" }'
    }
  }
];
