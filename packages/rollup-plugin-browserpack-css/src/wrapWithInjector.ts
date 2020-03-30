import stringHash from "string-hash";
export function wrapWithStyleInjector(css: string) {
  const hash = "browserpack-injected-" + stringHash(css);
  return `if(typeof window === "object" && !document.getElementById("${hash}")){
  const style = document.createElement("style");
  style.id = "${hash}";
  style.appendChild(document.createTextNode(\`${css}\`));
  document.head.appendChild(style);
};`;
}
